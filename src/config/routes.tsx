import * as React from 'react';
const { lazy } = React;

// Lazy loading para melhor performance
const Index = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const ProtectedRoute = lazy(() => import('@/components/ProtectedRoute'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Financial = lazy(() => import('@/pages/Financial'));
const Customers = lazy(() => import('@/pages/Customers'));
const Sales = lazy(() => import('@/pages/Sales'));
const Products = lazy(() => import('@/pages/Products'));
const Analysis = lazy(() => import('@/pages/Analysis'));
const Config = lazy(() => import('@/pages/Config'));
const Commercial = lazy(() => import('@/pages/Commercial'));
const Reports = lazy(() => import('@/pages/Reports'));
const Content = lazy(() => import('@/pages/Content'));
const Campaigns = lazy(() => import('@/pages/Campaigns'));
const CRMOverview = lazy(() => import('@/pages/CRMOverview'));
const ModuleAnalysis = lazy(() => import('@/pages/ModuleAnalysis'));
const Filters = lazy(() => import('@/pages/Filters'));
const Templates = lazy(() => import('@/pages/Templates'));
const Promotions = lazy(() => import('@/pages/Promotions'));
const Calendar = lazy(() => import('@/pages/Calendar'));
const TasksNotifications = lazy(() => import('@/pages/TasksNotifications'));
const UserManagement = lazy(() => import('@/pages/UserManagement'));
const Performance = lazy(() => import('@/pages/Performance'));
const MarketingAutomation = lazy(() => import('@/pages/MarketingAutomation'));
const AIDashboard = lazy(() => import('@/pages/AIDashboard'));
const Backup = lazy(() => import('@/pages/Backup'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const DataQuality = lazy(() => import('@/pages/DataQuality'));
const ProductionSetup = lazy(() => import('@/pages/ProductionSetup'));
const Quotes = lazy(() => import('@/pages/Quotes'));

// Content sub-pages
const ContentPlan = lazy(() => import('@/pages/content/ContentPlan'));
const Social = lazy(() => import('@/pages/content/Social'));
const Ads = lazy(() => import('@/pages/content/Ads'));

// CRM & Financeiro (PT) pages
const Leads = lazy(() => import('@/pages/Leads'));
const ClientesPT = lazy(() => import('@/pages/Clientes'));
const Oportunidades = lazy(() => import('@/pages/Oportunidades'));
const VendasPT = lazy(() => import('@/pages/Vendas'));
const FinanceiroDashboard = lazy(() => import('@/pages/FinanceiroDashboard'));
const FinanceiroUploadXLSX = lazy(() => import('@/pages/FinanceiroUploadXLSX'));
const ConfiguracoesIntegracoes = lazy(() => import('@/pages/ConfiguracoesIntegracoes'));

// Campaign sub-pages
const GoogleCampaigns = lazy(() => import('@/pages/campaigns/GoogleCampaigns'));

export interface RouteConfig {
  path: string;
  element: React.LazyExoticComponent<React.ComponentType<any>>;
  children?: RouteConfig[];
}

export const routes: RouteConfig[] = [
  { path: '/', element: Index },
  { path: '/auth', element: Auth },
  { path: '/dashboard', element: Dashboard },
  { path: '/financial', element: Financial },
  { path: '/customers', element: Customers },
  { path: '/sales', element: Sales },
  { path: '/products', element: Products },
  { path: '/analysis', element: Analysis },
  { path: '/config', element: Config },
  { path: '/commercial', element: Commercial },
  { path: '/reports', element: Reports },
  { path: '/content', element: Content },
  { path: '/campaigns', element: Campaigns },
  { path: '/crm-overview', element: CRMOverview },
  { path: '/crm', element: CRMOverview },
  { path: '/module-analysis', element: ModuleAnalysis },
  { path: '/filters', element: Filters },
  { path: '/templates', element: Templates },
  { path: '/promotions', element: Promotions },
  { path: '/calendar', element: Calendar },
  { path: '/tasks', element: TasksNotifications },
  { path: '/users', element: UserManagement },
  { path: '/performance', element: Performance },
  { path: '/automation', element: MarketingAutomation },
  { path: '/ai-dashboard', element: AIDashboard },
  { path: '/backup', element: Backup },
  { path: '/data-quality', element: DataQuality },
  { path: '/production-setup', element: ProductionSetup },
  { path: '/quotes', element: Quotes },
  // New PT routes
  { path: '/leads', element: Leads },
  { path: '/clientes', element: ClientesPT },
  { path: '/oportunidades', element: Oportunidades },
  { path: '/vendas', element: VendasPT },
  { path: '/financeiro', element: FinanceiroDashboard },
  { path: '/financeiro/upload', element: FinanceiroUploadXLSX },
  { path: '/config-integracoes', element: ConfiguracoesIntegracoes },
];

export const contentRoutes: RouteConfig[] = [
  { path: '/content/plan', element: ContentPlan },
  { path: '/content/social', element: Social },
  { path: '/content/ads', element: Ads },
];

export const campaignRoutes: RouteConfig[] = [
  { path: '/campaigns/google', element: GoogleCampaigns },
];

export { NotFound };