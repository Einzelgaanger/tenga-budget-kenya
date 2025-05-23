import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useFeedback } from '@/hooks/use-feedback';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { LogOut, RefreshCw } from 'lucide-react';
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
  ResponsiveContainer
} from 'recharts';

const Admin = () => {
  const { feedbacks, refetchFeedbacks, isLoading } = useFeedback();
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
  };  // Modern vibrant color palette for charts
  const COLORS = [
    'hsl(222, 47%, 40%)',  // Primary blue
    'hsl(186, 86%, 53%)',  // Bright cyan
    'hsl(262, 83%, 58%)',  // Vibrant purple
    'hsl(142, 76%, 36%)',  // Rich green
    'hsl(38, 92%, 50%)',   // Warm amber
    'hsl(199, 89%, 48%)'   // Sky blue
  ];

  // Enhanced chart global options
  const chartOptions = {
    style: {
      background: 'transparent'
    },
    animate: {
      duration: 1000,
      easing: 'ease-out'
    },
    legend: {
      iconSize: 12,
      iconType: 'circle',
      formatter: (value: string) => value.toUpperCase()
    },
    tooltip: {
      contentStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '8px 12px'
      }
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 sm:py-8 px-3 sm:px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex flex-wrap w-full sm:w-auto gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-1 text-sm sm:text-base flex-1 sm:flex-none justify-center"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden xs:inline">{isLoading ? 'Refreshing...' : 'Refresh Data'}</span>
              <span className="xs:hidden">Refresh</span>
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm sm:text-base flex-1 sm:flex-none justify-center"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <Card className="mb-8">
            <CardContent className="pt-6 text-center py-20">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                <div className="h-6 w-48 rounded bg-gray-300"></div>
                <div className="h-4 w-64 rounded bg-gray-300"></div>
              </div>
            </CardContent>
          </Card>
        ) : feedbacks.length === 0 ? (
          <Card className="mb-8">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500 mt-4">No feedback submissions yet. Once users fill out the questionnaire, their responses will appear here.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-8 shadow-md">
              <CardHeader>
                <h2 className="text-xl font-bold">Summary Statistics</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <h3 className="font-medium text-gray-700">Total Submissions</h3>
                    <p className="text-3xl font-bold text-emerald-600">{feedbacks.length}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md text-center">                    <h3 className="font-medium text-gray-700">Mpesa App Users</h3>
                    <p className="text-3xl font-bold text-emerald-600">
                      {feedbacks.filter(f => f.demographic.usesMpesa).length}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <h3 className="font-medium text-gray-700">Would Use Tenga Pesa</h3>
                    <p className="text-3xl font-bold text-emerald-600">
                      {feedbacks.filter(f => f.reactionToTengaPesa.wouldUseFeature === "Definitely").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="demographics" className="mb-8">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
                <TabsTrigger value="demographics" className="text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2">Demographics</TabsTrigger>
                <TabsTrigger value="financial" className="text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2">Financial Habits</TabsTrigger>
                <TabsTrigger value="reactions" className="text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2">Reactions</TabsTrigger>
                <TabsTrigger value="responses" className="text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2">All Responses</TabsTrigger>
              </TabsList>
              
              <TabsContent value="demographics">
                <Card className="shadow-md">
                  <CardHeader>
                    <h2 className="text-xl font-bold">Demographic Information</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      <div>
                        <h3 className="text-base sm:text-lg font-medium mb-2 text-center sm:text-left">Age Groups</h3>
                        <div className="h-56 sm:h-64">
                          <ResponsiveContainer width="100%" height="100%" className="mx-auto">
                            <PieChart>
                              <Pie
                                data={countResponses('demographic.ageGroup')}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {countResponses('demographic.ageGroup').map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Occupation</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={countResponses('demographic.occupation')}
                              layout="vertical"
                              margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                            >
                              <XAxis type="number" />
                              <YAxis type="category" dataKey="name" width={100} />
                              <Tooltip />
                              <Bar dataKey="value" fill="#2ECC71" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Income Range</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={countResponses('demographic.incomeRange')}
                              margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                            >
                              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" fill="#3498DB" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Mpesa App Usage</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Yes', value: feedbacks.filter(f => f.demographic.usesMpesa).length },
                                  { name: 'No', value: feedbacks.filter(f => !f.demographic.usesMpesa).length }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                <Cell fill="#2ECC71" />
                                <Cell fill="#E74C3C" />
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="financial">
                <Card className="shadow-md">
                  <CardHeader>
                    <h2 className="text-xl font-bold">Financial Habits</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Budget Following</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={countResponses('financialHabits.followsBudget')}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {countResponses('financialHabits.followsBudget').map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Runs Out of Money</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={countResponses('financialHabits.runsOutOfMoney')}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" fill="#E67E22" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Saves Money</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={countResponses('financialHabits.savesMoney')}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {countResponses('financialHabits.savesMoney').map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reactions">
                <Card className="shadow-md">
                  <CardHeader>
                    <h2 className="text-xl font-bold">Reactions to Tenga Pesa</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Would Use Feature</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={countResponses('reactionToTengaPesa.wouldUseFeature')}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {countResponses('reactionToTengaPesa.wouldUseFeature').map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Feeling About Penalty</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={countResponses('reactionToTengaPesa.feelingAboutPenalty')}
                              layout="vertical"
                              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                            >
                              <XAxis type="number" />
                              <YAxis type="category" dataKey="name" width={150} />
                              <Tooltip />
                              <Bar dataKey="value" fill="#9B59B6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Thinks Tenga Pesa Helps</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={countResponses('finalThoughts.thinksTengaPesaHelps')}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {countResponses('finalThoughts.thinksTengaPesaHelps').map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="responses">
                <Card className="shadow-md">
                  <CardHeader>
                    <h2 className="text-xl font-bold">All Responses</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <Table className="min-w-[800px] w-full text-sm sm:text-base">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Age Group</TableHead>
                            <TableHead>Occupation</TableHead>
                            <TableHead>Income Range</TableHead>
                            <TableHead>Would Use Feature</TableHead>
                            <TableHead>Likes Withdrawal Rules</TableHead>
                            <TableHead>Thinks Helpful</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {feedbacks.map((feedback) => (
                            <TableRow key={feedback.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium">
                                {new Date(feedback.timestamp).toLocaleString()}
                              </TableCell>
                              <TableCell>{feedback.demographic.ageGroup}</TableCell>
                              <TableCell>{feedback.demographic.occupation}</TableCell>
                              <TableCell>{feedback.demographic.incomeRange}</TableCell>
                              <TableCell>{feedback.reactionToTengaPesa.wouldUseFeature}</TableCell>
                              <TableCell>{feedback.reactionToTengaPesa.findWithdrawalRulesHelpful}</TableCell>
                              <TableCell>{feedback.finalThoughts.thinksTengaPesaHelps}</TableCell>
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
