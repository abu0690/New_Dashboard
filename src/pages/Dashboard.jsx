import { TrendingUp, TrendingDown, Users, DollarSign, Ticket, ShoppingCart, Server, Clock, Activity } from 'lucide-react';

const metrics = [
  { 
    title: 'Total Customers', 
    value: '1,247', 
    change: '+12%', 
    trend: 'up',
    icon: Users,
    color: 'bg-blue-500'
  },
  { 
    title: 'Active Services', 
    value: '3,891', 
    change: '+8%', 
    trend: 'up',
    icon: Server,
    color: 'bg-green-500'
  },
  { 
    title: 'Revenue', 
    value: '$2.4M', 
    change: '+23%', 
    trend: 'up',
    icon: DollarSign,
    color: 'bg-emerald-500'
  },
  { 
    title: 'Open Tickets', 
    value: '47', 
    change: '-5%', 
    trend: 'down',
    icon: Ticket,
    color: 'bg-orange-500'
  },
  { 
    title: 'Pending Orders', 
    value: '23', 
    change: '+15%', 
    trend: 'up',
    icon: ShoppingCart,
    color: 'bg-purple-500'
  },
  { 
    title: 'Deployments', 
    value: '892', 
    change: '+7%', 
    trend: 'up',
    icon: Activity,
    color: 'bg-cyan-500'
  },
  { 
    title: 'System Uptime', 
    value: '99.8%', 
    change: '+0.2%', 
    trend: 'up',
    icon: Server,
    color: 'bg-teal-500'
  },
  { 
    title: 'Active Users', 
    value: '567', 
    change: '+18%', 
    trend: 'up',
    icon: Users,
    color: 'bg-indigo-500'
  },
  { 
    title: 'Avg Response Time', 
    value: '2.3h', 
    change: '-12%', 
    trend: 'down',
    icon: Clock,
    color: 'bg-pink-500'
  }
];

function MetricCard({ title, value, change, trend, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="text-white" size={24} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {change}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
}