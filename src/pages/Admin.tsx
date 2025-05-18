
import React from 'react';
import Layout from '@/components/Layout';
import { useFeedback } from '@/context/FeedbackContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  const { feedbacks } = useFeedback();

  // Helper function to count occurrences
  const countResponses = (field: string) => {
    const counts: Record<string, number> = {};
    
    feedbacks.forEach(feedback => {
      // Access nested properties using dynamic path
      const path = field.split('.');
      let value: any = feedback;
      for (const key of path) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key as keyof typeof value];
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

  // Colors for charts
  const COLORS = ['#2ECC71', '#3498DB', '#9B59B6', '#F1C40F', '#E67E22', '#E74C3C'];
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
        
        {feedbacks.length === 0 ? (
          <Card className="mb-8">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500 mt-4">No feedback submissions yet. Once users fill out the questionnaire, their responses will appear here.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-xl font-bold">Summary Statistics</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <h3 className="font-medium text-gray-700">Total Submissions</h3>
                    <p className="text-3xl font-bold text-mpesa-green">{feedbacks.length}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <h3 className="font-medium text-gray-700">M-PESA Users</h3>
                    <p className="text-3xl font-bold text-mpesa-green">
                      {feedbacks.filter(f => f.demographic.usesMpesa).length}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <h3 className="font-medium text-gray-700">Would Use Tenga Pesa</h3>
                    <p className="text-3xl font-bold text-mpesa-green">
                      {feedbacks.filter(f => f.reactionToTengaPesa.wouldUseFeature === "Definitely").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="demographics" className="mb-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                <TabsTrigger value="financial">Financial Habits</TabsTrigger>
                <TabsTrigger value="reactions">Reactions</TabsTrigger>
                <TabsTrigger value="responses">All Responses</TabsTrigger>
              </TabsList>
              
              <TabsContent value="demographics">
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-bold">Demographic Information</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Age Groups</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
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
                        <h3 className="text-lg font-medium mb-2">M-PESA Usage</h3>
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
                <Card>
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
                <Card>
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
                <Card>
                  <CardHeader>
                    <h2 className="text-xl font-bold">All Responses</h2>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-auto">
                      <Table>
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
                            <TableRow key={feedback.id}>
                              <TableCell>
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
