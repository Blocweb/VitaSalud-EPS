import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Bell, Building2, BookOpen, GraduationCap, Users, Calendar, Plus, TrendingUp, AlertCircle } from 'lucide-react';

// Demo data removed: these should be populated by API calls where available.
const keyStats: any[] = [];
const notifications: any[] = [];
const quickActions: any[] = [];

export function DashboardModule() {
  const userName = "Dr. Sarah Johnson";

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl mb-2">Welcome back, {userName}!</h1>
        <p className="text-teal-100">Here's a snapshot of your hospital training network.</p>
      </div>

      {/* Key Stats */}
      <div>
        <h2 className="text-xl text-gray-900 mb-4">Key Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {keyStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-2xl text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Recent Notifications</span>
              </CardTitle>
              <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                {notifications.length} New
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {notification.type === 'upcoming' && <Calendar className="h-4 w-4 text-orange-600" />}
                    {notification.type === 'new' && <Plus className="h-4 w-4 text-green-600" />}
                    {notification.type === 'completed' && <TrendingUp className="h-4 w-4 text-blue-600" />}
                    {notification.type === 'assignment' && <Users className="h-4 w-4 text-purple-600" />}
                    {notification.type === 'update' && <AlertCircle className="h-4 w-4 text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">View All Notifications</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto p-4 text-left"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-4 w-4 text-teal-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{action.title}</p>
                        <p className="text-xs text-gray-500">{action.description}</p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Advanced Cardiology</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">+5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Emergency Medicine</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">+3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pediatric Care</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">+7</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Course Completions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Basic Surgery</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">12 completed</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Diagnostic Imaging</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">8 completed</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Patient Care</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">15 completed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Branch Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Lahore Branch</span>
                <Badge variant="secondary" className="bg-teal-100 text-teal-800">98% completion</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Karachi Branch</span>
                <Badge variant="secondary" className="bg-teal-100 text-teal-800">94% completion</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Islamabad Branch</span>
                <Badge variant="secondary" className="bg-teal-100 text-teal-800">96% completion</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}