
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useFeedback } from '@/hooks/use-feedback';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  RefreshCw, 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon,
  Users,
  Wallet,
  LineChart,
  TrendingUp,
  ThumbsUp 
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Sector
} from 'recharts';

const Admin = () => {
  const { feedbacks, refetchFeedbacks, isLoading } = useFeedback();
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activePieIndex, setActivePieIndex] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    // Fetch data when component mounts and we're authenticated
    refetchFeedbacks().catch(console.error);
  }, [isAuthenticated, navigate, refetchFeedbacks]);

  // Helper function to count occurrences with proper typing
  const countResponses = (field: string) => {
    const counts: Record<string, number> = {};
    
    feedbacks.forEach(feedback => {
      // Access nested properties using dynamic path
      const path = field.split('.');
      let value: unknown = feedback;
      
      for (const key of path) {
        if (value && typeof value === 'object' && key in (value as object)) {
          value = (value as Record<string, unknown>)[key];
        } else {
          value = undefined;
          break;
        }
      }
      
      if (value !== undefined) {
        const strValue = String(value);
        counts[strValue] = (counts[strValue] || 0) + 1;
      }
    });
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate('/');
  };

  const handleRefresh = async () => {
    await refetchFeedbacks();
    toast.success("Data refreshed");
  };

  // Enhanced vibrant color palette for charts
  const COLORS = [
    '#1E88E5',  // Brand blue
    '#FF5722',  // Brand orange
    '#2ECC71',  // Green
    '#9C27B0',  // Purple
    '#F44336',  // Red
    '#FFEB3B',  // Yellow
    '#00BCD4',  // Cyan
    '#FF9800',  // Light Orange
  ];

  // Pie chart active sector rendering
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={2} />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-sm">
          {`${value} (${(percent * 100).toFixed(0)}%)`}
        </text>
      </g>
    );
  };

  // Custom tooltip styles with brand colors
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-md border border-gray-200">
          <p className="font-medium text-gray-700">{`${label || payload[0].name}`}</p>
          <p className="text-brand-secondary font-bold">{`Count: ${payload[0].value}`}</p>
          <p className="text-accent-orange text-xs">
            {`${(payload[0].payload.percent * 100).toFixed(1)}% of total`}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 sm:py-8 px-3 sm:px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-brand-secondary">
            <LineChart className="h-7 w-7" />
            Admin Dashboard
          </h1>
          <div className="flex flex-wrap w-full sm:w-auto gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-1 text-sm sm:text-base flex-1 sm:flex-none justify-center hover:bg-brand-secondary hover:text-white transition-all duration-300"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">{isLoading ? 'Refreshing...' : 'Refresh Data'}</span>
              <span className="xs:hidden">Refresh</span>
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm sm:text-base flex-1 sm:flex-none justify-center bg-accent-red hover:bg-accent-red/80 transition-all duration-300"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <Card className="mb-8 shadow-lg border-t-4 border-t-brand-secondary animate-pulse">
            <CardContent className="pt-6 text-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="h-6 w-48 rounded bg-gray-300 animate-pulse"></div>
                <div className="h-4 w-64 rounded bg-gray-300 animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ) : feedbacks.length === 0 ? (
          <Card className="mb-8 shadow-lg border-t-4 border-t-accent-orange">
            <CardContent className="pt-6 text-center py-10">
              <Users className="h-16 w-16 text-accent-orange mx-auto mb-4 opacity-50" />
              <p className="text-gray-500 mt-4">No feedback submissions yet. Once users fill out the questionnaire, their responses will appear here.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-8 shadow-lg border-t-4 border-t-accent-green hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent-green" />
                  Summary Statistics
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-brand-secondary/10 to-transparent p-6 rounded-md text-center shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-brand-secondary">
                    <h3 className="font-medium text-gray-700">Total Submissions</h3>
                    <p className="text-4xl font-bold text-brand-secondary mt-2 animate-fade-in">{feedbacks.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-accent-green/10 to-transparent p-6 rounded-md text-center shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-accent-green">
                    <h3 className="font-medium text-gray-700">M-PESA Users</h3>
                    <p className="text-4xl font-bold text-accent-green mt-2 animate-fade-in">
                      {feedbacks.filter(f => f.demographic.usesMpesa).length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-accent-orange/10 to-transparent p-6 rounded-md text-center shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-accent-orange">
                    <h3 className="font-medium text-gray-700">Would Use Tenga Pesa</h3>
                    <p className="text-4xl font-bold text-accent-orange mt-2 animate-fade-in">
                      {feedbacks.filter(f => f.reactionToTengaPesa.wouldUseFeature === "Definitely").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="demographics" className="mb-8">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-muted/30">
                <TabsTrigger value="demographics" className="text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Demographics
                </TabsTrigger>
                <TabsTrigger value="financial" className="text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1">
                  <Wallet className="h-4 w-4" />
                  Financial
                </TabsTrigger>
                <TabsTrigger value="reactions" className="text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  Reactions
                </TabsTrigger>
                <TabsTrigger value="responses" className="text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2 flex items-center gap-1">
                  <BarChartIcon className="h-4 w-4" />
                  All Responses
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="demographics" className="animate-fade-in">
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="border-b border-border/30 bg-brand-primary/5">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Users className="h-5 w-5 text-brand-secondary" />
                      Demographic Information
                    </h2>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                        <h3 className="text-base sm:text-lg font-medium mb-2 text-center sm:text-left flex items-center gap-1 justify-center sm:justify-start">
                          <PieChartIcon className="h-4 w-4 text-brand-secondary" />
                          Age Groups
                        </h3>
                        <div className="h-64 sm:h-72 p-2">
                          <ResponsiveContainer width="100%" height="100%" className="mx-auto">
                            <PieChart>
                              <Pie
                                data={countResponses('demographic.ageGroup')}
                                cx="50%"
                                cy="50%"
                                activeIndex={activePieIndex}
                                activeShape={renderActiveShape}
                                onMouseEnter={(_, index) => setActivePieIndex(index)}
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {countResponses('demographic.ageGroup').map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                    className="hover:opacity-80 transition-opacity" 
                                  />
                                ))}
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-1 justify-center sm:justify-start">
                          <BarChartIcon className="h-4 w-4 text-accent-orange" />
                          Occupation
                        </h3>
                        <div className="h-64 sm:h-72 p-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={countResponses('demographic.occupation')}
                              layout="vertical"
                              margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                            >
                              <XAxis type="number" />
                              <YAxis 
                                type="category" 
                                dataKey="name" 
                                width={100} 
                                tick={{ fill: '#333', fontSize: 12 }} 
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar dataKey="value">
                                {countResponses('demographic.occupation').map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                    className="hover:opacity-80 transition-opacity" 
                                  />
                                ))}
                                <LabelList 
                                  dataKey="value" 
                                  position="right" 
                                  fill="#333" 
                                  style={{ fontWeight: 'bold' }} 
                                />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-1 justify-center sm:justify-start">
                          <BarChartIcon className="h-4 w-4 text-accent-green" />
                          Income Range
                        </h3>
                        <div className="h-64 sm:h-72 p-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={countResponses('demographic.incomeRange')}
                              margin={{ top: 5, right: 30, left: 5, bottom: 40 }}
                            >
                              <XAxis 
                                dataKey="name" 
                                angle={-45} 
                                textAnchor="end" 
                                height={80} 
                                tick={{ fill: '#333', fontSize: 12 }} 
                              />
                              <YAxis tick={{ fill: '#333' }} />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar dataKey="value">
                                {countResponses('demographic.incomeRange').map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                    className="hover:opacity-80 transition-opacity" 
                                  />
                                ))}
                                <LabelList 
                                  dataKey="value" 
                                  position="top" 
                                  fill="#333" 
                                  style={{ fontWeight: 'bold' }} 
                                />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-1 justify-center sm:justify-start">
                          <PieChartIcon className="h-4 w-4 text-accent-red" />
                          M-PESA Usage
                        </h3>
                        <div className="h-64 sm:h-72 p-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Yes', value: feedbacks.filter(f => f.demographic.usesMpesa).length },
                                  { name: 'No', value: feedbacks.filter(f => !f.demographic.usesMpesa).length }
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                <Cell fill="#2ECC71" />
                                <Cell fill="#E74C3C" />
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                              <Legend 
                                formatter={(value) => <span className="text-sm font-medium">{value}</span>} 
                                iconSize={12} 
                                iconType="circle" 
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="financial" className="animate-fade-in">
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="border-b border-border/30 bg-brand-primary/5">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-accent-green" />
                      Financial Habits
                    </h2>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-1 justify-center sm:justify-start">
                          <PieChartIcon className="h-4 w-4 text-brand-secondary" />
                          Budget Following
                        </h3>
                        <div className="h-64 sm:h-72 p-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={countResponses('financialHabits.followsBudget')}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {countResponses('financialHabits.followsBudget').map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                    className="hover:opacity-80 transition-opacity" 
                                  />
                                ))}
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-1 justify-center sm:justify-start">
                          <BarChartIcon className="h-4 w-4 text-accent-orange" />
                          Runs Out of Money
                        </h3>
                        <div className="h-64 sm:h-72 p-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={countResponses('financialHabits.runsOutOfMoney')}
                              margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
                            >
                              <XAxis 
                                dataKey="name" 
                                tick={{ fill: '#333', fontSize: 12 }}
                              />
                              <YAxis tick={{ fill: '#333' }} />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar dataKey="value">
                                {countResponses('financialHabits.runsOutOfMoney').map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                    className="hover:opacity-80 transition-opacity" 
                                  />
                                ))}
                                <LabelList 
                                  dataKey="value" 
                                  position="top" 
                                  fill="#333" 
                                  style={{ fontWeight: 'bold' }} 
                                />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-1 justify-center sm:justify-start">
                          <PieChartIcon className="h-4 w-4 text-accent-green" />
                          Saves Money
                        </h3>
                        <div className="h-64 sm:h-72 p-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={countResponses('financialHabits.savesMoney')}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {countResponses('financialHabits.savesMoney').map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                    className="hover:opacity-80 transition-opacity" 
                                  />
                                ))}
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reactions" className="animate-fade-in">
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="border-b border-border/30 bg-brand-primary/5">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <ThumbsUp className="h-5 w-5 text-accent-orange" />
                      Reactions to Tenga Pesa
                    </h2>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-1 justify-center sm:justify-start">
                          <PieChartIcon className="h-4 w-4 text-brand-secondary" />
                          Would Use Feature
                        </h3>
                        <div className="h-64 sm:h-72 p-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={countResponses('reactionToTengaPesa.wouldUseFeature')}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {countResponses('reactionToTengaPesa.wouldUseFeature').map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                    className="hover:opacity-80 transition-opacity" 
                                  />
                                ))}
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-1 justify-center sm:justify-start">
                          <BarChartIcon className="h-4 w-4 text-accent-purple" />
                          Feeling About Penalty
                        </h3>
                        <div className="h-64 sm:h-72 p-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={countResponses('reactionToTengaPesa.feelingAboutPenalty')}
                              layout="vertical"
                              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                            >
                              <XAxis type="number" />
                              <YAxis 
                                type="category" 
                                dataKey="name" 
                                width={150}
                                tick={{ fill: '#333', fontSize: 12 }} 
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar dataKey="value">
                                {countResponses('reactionToTengaPesa.feelingAboutPenalty').map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                    className="hover:opacity-80 transition-opacity" 
                                  />
                                ))}
                                <LabelList 
                                  dataKey="value" 
                                  position="right" 
                                  fill="#333" 
                                  style={{ fontWeight: 'bold' }} 
                                />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-1 justify-center sm:justify-start">
                          <PieChartIcon className="h-4 w-4 text-accent-red" />
                          Thinks Tenga Pesa Helps
                        </h3>
                        <div className="h-64 sm:h-72 p-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={countResponses('finalThoughts.thinksTengaPesaHelps')}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {countResponses('finalThoughts.thinksTengaPesaHelps').map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                    className="hover:opacity-80 transition-opacity" 
                                  />
                                ))}
                              </Pie>
                              <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="responses" className="animate-fade-in">
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="border-b border-border/30 bg-brand-primary/5">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <BarChartIcon className="h-5 w-5 text-brand-secondary" />
                      All Responses
                    </h2>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <Table className="min-w-[800px] w-full text-sm sm:text-base">
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="bg-brand-secondary/10 font-bold">Timestamp</TableHead>
                            <TableHead className="bg-brand-secondary/10 font-bold">Age Group</TableHead>
                            <TableHead className="bg-brand-secondary/10 font-bold">Occupation</TableHead>
                            <TableHead className="bg-brand-secondary/10 font-bold">Income Range</TableHead>
                            <TableHead className="bg-brand-secondary/10 font-bold">Would Use Feature</TableHead>
                            <TableHead className="bg-brand-secondary/10 font-bold">Likes Withdrawal Rules</TableHead>
                            <TableHead className="bg-brand-secondary/10 font-bold">Thinks Helpful</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {feedbacks.map((feedback, index) => (
                            <TableRow 
                              key={feedback.id} 
                              className={`hover:bg-brand-light transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                            >
                              <TableCell className="font-medium">
                                {new Date(feedback.timestamp).toLocaleString()}
                              </TableCell>
                              <TableCell>{feedback.demographic.ageGroup}</TableCell>
                              <TableCell>{feedback.demographic.occupation}</TableCell>
                              <TableCell>{feedback.demographic.incomeRange}</TableCell>
                              <TableCell>
                                <span 
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    feedback.reactionToTengaPesa.wouldUseFeature === 'Definitely' 
                                      ? 'bg-accent-green/20 text-accent-green' 
                                      : feedback.reactionToTengaPesa.wouldUseFeature === 'Probably' 
                                      ? 'bg-accent-blue/20 text-accent-blue'
                                      : 'bg-accent-orange/20 text-accent-orange'
                                  }`}
                                >
                                  {feedback.reactionToTengaPesa.wouldUseFeature}
                                </span>
                              </TableCell>
                              <TableCell>{feedback.reactionToTengaPesa.findWithdrawalRulesHelpful}</TableCell>
                              <TableCell>
                                <span 
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    feedback.finalThoughts.thinksTengaPesaHelps === 'Yes' 
                                      ? 'bg-accent-green/20 text-accent-green' 
                                      : feedback.finalThoughts.thinksTengaPesaHelps === 'Maybe' 
                                      ? 'bg-accent-yellow/20 text-accent-yellow'
                                      : 'bg-accent-red/20 text-accent-red'
                                  }`}
                                >
                                  {feedback.finalThoughts.thinksTengaPesaHelps}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
