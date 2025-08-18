import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProductData {
  name: string;
  sku?: string;
  description?: string;
  category?: string;
  supplier?: string;
  price?: number;
  weight?: number;
  dimensions?: string;
  imageUrl?: string;
  availability?: string;
}

interface FieldMapping {
  [key: string]: string;
}

const defaultFieldMapping: FieldMapping = {
  'g:title': 'name',
  'g:description': 'description', 
  'g:product_type': 'category',
  'g:brand': 'supplier',
  'g:sale_price': 'price',
  'g:shipping_weight': 'weight',
  'g:product_length': 'length',
  'g:product_width': 'width', 
  'g:product_height': 'height',
  'g:image_link': 'imageUrl',
  'g:availability': 'availability',
  'g:id': 'sku'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { xmlUrl, customMapping, dryRun = false } = await req.json()

    if (!xmlUrl) {
      return new Response(
        JSON.stringify({ error: 'URL do XML é obrigatória' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Iniciando importação XML:', xmlUrl)

    // Fetch XML content
    const xmlResponse = await fetch(xmlUrl)
    if (!xmlResponse.ok) {
      throw new Error(`Erro ao buscar XML: ${xmlResponse.status} ${xmlResponse.statusText}`)
    }

    const xmlText = await xmlResponse.text()
    console.log('XML obtido, tamanho:', xmlText.length)

    // Parse XML
    const products = await parseXMLProducts(xmlText, customMapping || defaultFieldMapping)
    console.log('Produtos extraídos:', products.length)

    let importResults = {
      total: products.length,
      success: 0,
      errors: 0,
      warnings: 0,
      details: [] as any[],
      summary: {
        byCategory: {} as Record<string, number>,
        totalValue: 0,
        averagePrice: 0
      }
    }

    if (dryRun) {
      // Apenas validação, não importa
      importResults.details = products.map(product => ({
        product,
        status: 'preview',
        validations: validateProduct(product)
      }))
    } else {
      // Importação real
      for (const product of products) {
        try {
          const validations = validateProduct(product)
          
          if (validations.errors.length > 0) {
            importResults.errors++
            importResults.details.push({
              product,
              status: 'error',
              validations
            })
            continue
          }

          // Transformar dados para o formato da tabela products
          const productData = transformProductData(product)

          // Verificar se produto já existe
          const { data: existingProduct } = await supabase
            .from('products')
            .select('id')
            .eq('sku', productData.sku || productData.name)
            .single()

          if (existingProduct) {
            // Atualizar produto existente
            const { error } = await supabase
              .from('products')
              .update(productData)
              .eq('id', existingProduct.id)

            if (error) throw error
            
            importResults.details.push({
              product,
              status: 'updated',
              validations
            })
          } else {
            // Criar novo produto
            const { error } = await supabase
              .from('products')
              .insert(productData)

            if (error) throw error
            
            importResults.details.push({
              product,
              status: 'created',
              validations
            })
          }

          importResults.success++
          
          // Atualizar estatísticas
          if (product.category) {
            importResults.summary.byCategory[product.category] = 
              (importResults.summary.byCategory[product.category] || 0) + 1
          }
          
          if (product.price) {
            importResults.summary.totalValue += product.price
          }

        } catch (error) {
          console.error('Erro ao importar produto:', error)
          importResults.errors++
          importResults.details.push({
            product,
            status: 'error',
            error: error.message
          })
        }
      }

      // Calcular média de preços
      if (importResults.success > 0) {
        importResults.summary.averagePrice = importResults.summary.totalValue / importResults.success
      }
    }

    console.log('Importação concluída:', importResults)

    return new Response(
      JSON.stringify(importResults),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro na importação XML:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Erro na importação XML',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function parseXMLProducts(xmlText: string, fieldMapping: FieldMapping): Promise<ProductData[]> {
  const products: ProductData[] = []
  
  try {
    // Parse XML usando DOMParser
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
    
    // Verificar erros de parsing
    const parserError = xmlDoc.querySelector('parsererror')
    if (parserError) {
      throw new Error('XML mal formado: ' + parserError.textContent)
    }

    // Buscar items no XML (podem estar em diferentes estruturas)
    const items = xmlDoc.querySelectorAll('item, entry, product')
    
    console.log('Items encontrados no XML:', items.length)

    for (const item of items) {
      const product: ProductData = {}
      
      // Aplicar mapeamentos
      for (const [xmlTag, productField] of Object.entries(fieldMapping)) {
        const element = item.querySelector(xmlTag)
        if (element && element.textContent) {
          const value = element.textContent.trim()
          
          // Aplicar transformações específicas por campo
          switch (productField) {
            case 'price':
              const priceMatch = value.match(/[\d.,]+/)
              product.price = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : undefined
              break
            case 'weight':
              const weightMatch = value.match(/[\d.,]+/)
              product.weight = weightMatch ? parseFloat(weightMatch[0].replace(',', '.')) : undefined
              break
            case 'length':
            case 'width':
            case 'height':
              // Construir string de dimensões
              if (!product.dimensions) product.dimensions = ''
              const dimension = value.match(/[\d.,]+/)
              if (dimension) {
                product.dimensions += `${productField}: ${dimension[0]} `
              }
              break
            default:
              product[productField as keyof ProductData] = value
          }
        }
      }

      // Apenas adicionar se tiver pelo menos nome
      if (product.name) {
        products.push(product)
      }
    }

  } catch (error) {
    console.error('Erro ao fazer parse do XML:', error)
    throw new Error(`Erro ao processar XML: ${error.message}`)
  }

  return products
}

function validateProduct(product: ProductData) {
  const errors: string[] = []
  const warnings: string[] = []

  // Validações obrigatórias
  if (!product.name || product.name.length < 2) {
    errors.push('Nome do produto é obrigatório e deve ter pelo menos 2 caracteres')
  }

  // Validações de formato
  if (product.price && (isNaN(product.price) || product.price < 0)) {
    errors.push('Preço deve ser um número positivo')
  }

  if (product.weight && (isNaN(product.weight) || product.weight < 0)) {
    errors.push('Peso deve ser um número positivo')
  }

  // Avisos para campos importantes ausentes
  if (!product.description) {
    warnings.push('Descrição não informada')
  }

  if (!product.category) {
    warnings.push('Categoria não informada')
  }

  if (!product.price) {
    warnings.push('Preço não informado')
  }

  if (!product.sku) {
    warnings.push('SKU não informado - será usado o nome do produto')
  }

  return { errors, warnings }
}

function transformProductData(product: ProductData) {
  return {
    name: product.name,
    sku: product.sku || product.name,
    description: product.description || '',
    category: product.category || 'Sem categoria',
    supplier: product.supplier || 'Winnet Metais',
    price: product.price || 0,
    cost_price: product.price ? product.price * 0.7 : 0, // Estimativa de 30% de margem
    weight: product.weight || 0,
    dimensions: product.dimensions || '',
    image_url: product.imageUrl || '',
    active: true,
    stock_current: 0, // Valor padrão
    stock_min: 0,
    unit: 'unidade'
  }
}