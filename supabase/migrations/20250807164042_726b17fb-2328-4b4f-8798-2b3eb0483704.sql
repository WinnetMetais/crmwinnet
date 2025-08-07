-- Primeiro, verificar se a tabela content_templates permite templates do sistema
-- Se não, vamos adicionar uma coluna para indicar templates do sistema
ALTER TABLE content_templates ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE content_templates ADD COLUMN IF NOT EXISTS is_system_template BOOLEAN DEFAULT FALSE;

-- Inserir templates de conteúdo do sistema para marketing e comunicação
INSERT INTO content_templates (name, category, template_content, variables, active, is_system_template) VALUES
('Email de Boas-vindas', 'email', 
'Olá {{cliente_nome}},

Bem-vindo à Winnet Metais! 

Somos especializados em produtos metalúrgicos de alta qualidade e estamos aqui para atender suas necessidades.

Nossa equipe está à disposição para esclarecer dúvidas e apresentar nossos produtos.

Atenciosamente,
Equipe Winnet Metais', 
'["cliente_nome"]', true, true),

('Proposta Comercial WhatsApp', 'whatsapp',
'🏭 *WINNET METAIS* 🏭

Olá {{cliente_nome}}! 

Preparamos uma proposta especial para você:

📋 *Produto:* {{produto}}
📏 *Quantidade:* {{quantidade}}
💰 *Valor:* R$ {{valor}}
📅 *Prazo de entrega:* {{prazo}}

Gostaria de agendar uma reunião para apresentarmos mais detalhes?

*Winnet Metais - Qualidade que você pode confiar*', 
'["cliente_nome", "produto", "quantidade", "valor", "prazo"]', true, true),

('Follow-up Pós-Venda', 'email',
'Olá {{cliente_nome}},

Como está sua experiência com os produtos Winnet Metais?

Gostaríamos de saber se:
✅ Os produtos atenderam suas expectativas
✅ O prazo de entrega foi cumprido
✅ Precisa de algum suporte adicional

Seu feedback é muito importante para continuarmos melhorando nossos serviços.

Aguardamos seu retorno!

Equipe Winnet Metais
{{contato_vendedor}}', 
'["cliente_nome", "contato_vendedor"]', true, true),

('Lembrete de Reunião', 'whatsapp',
'📅 *LEMBRETE - REUNIÃO WINNET METAIS*

Olá {{cliente_nome}}!

Lembrando de nossa reunião:
🕐 *Data:* {{data}}
🕑 *Horário:* {{horario}}
📍 *Local:* {{local}}
📋 *Assunto:* {{assunto}}

Confirma sua presença?

*Winnet Metais*', 
'["cliente_nome", "data", "horario", "local", "assunto"]', true, true),

('Oferta Especial', 'email',
'🎯 *OFERTA ESPECIAL WINNET METAIS* 🎯

{{cliente_nome}}, temos uma oportunidade imperdível!

🔥 *{{produto}}*
💲 Desconto de *{{desconto}}%*
⏰ Válida até: *{{data_limite}}*
📦 Estoque limitado

Esta é uma oportunidade única para adquirir produtos Winnet com preços especiais.

Entre em contato conosco:
📞 {{telefone}}
📧 {{email}}

*Não perca esta chance!*

Equipe Winnet Metais', 
'["cliente_nome", "produto", "desconto", "data_limite", "telefone", "email"]', true, true);

-- Inserir configurações do sistema específicas para Winnet
INSERT INTO system_settings (setting_key, setting_value, description) 
SELECT * FROM (VALUES 
  ('company_info', '{
    "name": "Winnet Metais",
    "cnpj": "00.000.000/0001-00",
    "address": "Endereço da Winnet Metais",
    "phone": "(11) 0000-0000",
    "email": "contato@winnetmetais.com.br",
    "website": "www.winnetmetais.com.br"
  }', 'Informações da empresa Winnet Metais'),
  ('default_margins', '{
    "margin_50": 50,
    "margin_55": 55,
    "margin_60": 60,
    "margin_65": 65,
    "margin_70": 70,
    "margin_75": 75
  }', 'Margens padrão para produtos'),
  ('crm_automation', '{
    "auto_follow_up_days": 7,
    "max_attempts": 3,
    "priority_response_hours": 24,
    "lead_scoring_enabled": true
  }', 'Configurações de automação do CRM'),
  ('notification_settings', '{
    "email_enabled": true,
    "whatsapp_enabled": true,
    "push_enabled": true,
    "daily_summary": true,
    "deal_alerts": true
  }', 'Configurações de notificações')
) AS new_settings(setting_key, setting_value, description)
WHERE NOT EXISTS (SELECT 1 FROM system_settings WHERE setting_key = new_settings.setting_key);