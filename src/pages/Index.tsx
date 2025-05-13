
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-10 px-4">
      <div className="container mx-auto flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-6">Plataforma de Integração de Anúncios</h1>
        <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl">
          Gerencie e integre suas campanhas publicitárias do Google Ads, Facebook/Instagram e LinkedIn em um único lugar.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-16">
          <div className="bg-card rounded-lg p-6 shadow-md flex flex-col items-center">
            <img src="https://cdn.cdnlogo.com/logos/g/35/google-ads.svg" alt="Google Ads" className="w-12 h-12 mb-4" />
            <h3 className="text-lg font-medium mb-2">Google Ads</h3>
            <p className="text-center text-muted-foreground mb-4">Integre suas campanhas do Google Ads e obtenha insights valiosos.</p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-md flex flex-col items-center">
            <img src="https://cdn.cdnlogo.com/logos/f/91/facebook-ads.svg" alt="Facebook Ads" className="w-12 h-12 mb-4" />
            <h3 className="text-lg font-medium mb-2">Facebook/Instagram Ads</h3>
            <p className="text-center text-muted-foreground mb-4">Gerencie suas campanhas de Facebook e Instagram de forma integrada.</p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-md flex flex-col items-center">
            <img src="https://cdn.cdnlogo.com/logos/l/37/linkedin-ads.svg" alt="LinkedIn Ads" className="w-12 h-12 mb-4" />
            <h3 className="text-lg font-medium mb-2">LinkedIn Ads</h3>
            <p className="text-center text-muted-foreground mb-4">Potencialize suas campanhas B2B com a integração do LinkedIn Ads.</p>
          </div>
        </div>
        
        <Button asChild size="lg">
          <Link to="/config">Configurar Integração</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
