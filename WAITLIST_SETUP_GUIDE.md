import React from 'react';
import { Terminal, Server, Database, Settings, Play, Bug, Globe, Wrench, FileText, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SetupGuide() {
  const quickSteps = [
    { command: "git clone [repository-url]", description: "Download the project" },
    { command: "cd waitlist-app", description: "Enter project directory" },
    { command: "npm install", description: "Install dependencies" },
    { command: "cp .env.example .env", description: "Copy environment file" },
    { command: "npm run build", description: "Build the application" },
    { command: "npm start", description: "Start the server" }
  ];

  const envVariables = [
    { name: "DATABASE_URL", value: "file:./data.db", required: true, description: "SQLite database path" },
    { name: "NEXTAUTH_SECRET", value: "[random-string]", required: true, description: "Authentication secret key" },
    { name: "NEXTAUTH_URL", value: "http://localhost:3000", required: false, description: "Site URL (auto-detected)" },
    { name: "TWILIO_ACCOUNT_SID", value: "[your-sid]", required: false, description: "SMS notifications (optional)" },
    { name: "TWILIO_AUTH_TOKEN", value: "[your-token]", required: false, description: "SMS authentication (optional)" },
    { name: "TWILIO_PHONE_NUMBER", value: "+1234567890", required: false, description: "SMS sender number (optional)" }
  ];

  const endpoints = [
    { method: "POST", path: "/api/waitlist", description: "Add user to waitlist", body: "{ email, firstName, lastName, phoneNumber }" },
    { method: "GET", path: "/api/waitlist", description: "Get all waitlist entries (admin)", auth: "Required" },
    { method: "PUT", path: "/api/waitlist/[id]", description: "Update entry status", body: "{ status }", auth: "Required" },
    { method: "DELETE", path: "/api/waitlist/[id]", description: "Remove entry", auth: "Required" },
    { method: "POST", path: "/api/export", description: "Export data as CSV", auth: "Required" }
  ];

  const troubleshooting = [
    {
      issue: "Database connection error",
      solution: "Ensure DATABASE_URL is correct and directory is writable. Run 'npx prisma generate' then 'npx prisma db push'."
    },
    {
      issue: "Port 3000 already in use",
      solution: "Change port with: PORT=3001 npm start or kill existing process: npx kill-port 3000"
    },
    {
      issue: "Module not found errors",
      solution: "Delete node_modules and package-lock.json, then run 'npm clean-install'"
    },
    {
      issue: "Prisma client errors",
      solution: "Regenerate client: 'npx prisma generate' and reset database: 'npx prisma db push --force-reset'"
    },
    {
      issue: "SMS not sending",
      solution: "Check Twilio credentials in .env file. Verify phone number format includes country code (+1)"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Waitlist Database Setup Guide
          </h1>
          <p className="text-lg text-gray-600">
            Complete setup instructions for your waitlist management system
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Play className="h-6 w-6 text-green-600" />
              <CardTitle>Quick Start</CardTitle>
            </div>
            <CardDescription>
              Get your waitlist running in under 5 minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quickSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <Badge variant="secondary" className="min-w-6 h-6 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <code className="flex-1 bg-black text-green-400 px-3 py-2 rounded text-sm font-mono">
                    {step.command}
                  </code>
                  <span className="text-sm text-gray-600">{step.description}</span>
                </div>
              ))}
            </div>
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Your app will be available at <strong>http://localhost:3000</strong>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              <CardTitle>Requirements</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Required Software</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Node.js 18+ and npm</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>VS Code (recommended)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Git for version control</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Check Your Version</h4>
                <div className="space-y-2">
                  <code className="block bg-black text-green-400 p-2 rounded text-sm">
                    node --version
                  </code>
                  <code className="block bg-black text-green-400 p-2 rounded text-sm">
                    npm --version
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Setup */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-purple-600" />
              <CardTitle>Database Setup</CardTitle>
            </div>
            <CardDescription>
              Initialize your SQLite database with Prisma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 mb-3">
                  The database will be automatically created on first run. For manual setup:
                </p>
                <div className="space-y-2">
                  <code className="block bg-black text-green-400 p-2 rounded text-sm">
                    npx prisma generate
                  </code>
                  <code className="block bg-black text-green-400 p-2 rounded text-sm">
                    npx prisma db push
                  </code>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Database Location</h4>
                  <p className="text-sm text-gray-600">
                    SQLite file: <code className="bg-gray-100 px-1 rounded">./data.db</code>
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Schema</h4>
                  <p className="text-sm text-gray-600">
                    Defined in: <code className="bg-gray-100 px-1 rounded">prisma/schema.prisma</code>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Environment Variables */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-orange-600" />
              <CardTitle>Environment Variables</CardTitle>
            </div>
            <CardDescription>
              Configure your .env file with these settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {envVariables.map((env, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <code className="font-semibold">{env.name}</code>
                      <Badge variant={env.required ? "destructive" : "secondary"}>
                        {env.required ? "Required" : "Optional"}
                      </Badge>
                    </div>
                  </div>
                  <code className="block bg-gray-100 p-2 rounded text-sm mb-2">
                    {env.name}={env.value}
                  </code>
                  <p className="text-sm text-gray-600">{env.description}</p>
                </div>
              ))}
            </div>
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Generate a secure NEXTAUTH_SECRET with: <code>openssl rand -base64 32</code>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Running the Application */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-6 w-6 text-green-600" />
              <CardTitle>Running the Application</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Development</h4>
                <code className="block bg-black text-green-400 p-3 rounded mb-2">
                  npm run dev
                </code>
                <p className="text-sm text-gray-600">
                  Hot reload enabled for development
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Production</h4>
                <div className="space-y-2">
                  <code className="block bg-black text-green-400 p-2 rounded text-sm">
                    npm run build
                  </code>
                  <code className="block bg-black text-green-400 p-2 rounded text-sm">
                    npm start
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-indigo-600" />
              <CardTitle>API Endpoints</CardTitle>
            </div>
            <CardDescription>
              Available endpoints for waitlist management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {endpoints.map((endpoint, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="font-mono">
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm">{endpoint.path}</code>
                    {endpoint.auth && (
                      <Badge variant="destructive" className="text-xs">
                        Auth Required
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{endpoint.description}</p>
                  {endpoint.body && (
                    <code className="block bg-gray-100 p-2 rounded text-xs">
                      Body: {endpoint.body}
                    </code>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Testing */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bug className="h-6 w-6 text-red-600" />
              <CardTitle>Testing the Waitlist</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Test the signup flow:</strong>
                  <br />1. Visit http://localhost:3000
                  <br />2. Fill out the waitlist form
                  <br />3. Check for confirmation message
                  <br />4. Visit /admin to view submissions
                </AlertDescription>
              </Alert>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Manual Testing</h4>
                  <p className="text-sm text-gray-600">
                    Use curl or Postman to test API endpoints directly
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Database Check</h4>
                  <p className="text-sm text-gray-600">
                    Use Prisma Studio: <code>npx prisma studio</code>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wrench className="h-6 w-6 text-yellow-600" />
              <CardTitle>Troubleshooting</CardTitle>
            </div>
            <CardDescription>
              Common issues and their solutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {troubleshooting.map((item, index) => (
                <div key={index} className="border-l-4 border-yellow-400 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {item.issue}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {item.solution}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Production Deployment */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-blue-600" />
              <CardTitle>Production Deployment</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Recommended Platforms</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Vercel (easiest for Next.js)</li>
                  <li>• Netlify</li>
                  <li>• Railway</li>
                  <li>• DigitalOcean App Platform</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Important Notes</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Set NODE_ENV=production</li>
                  <li>• Use PostgreSQL for production</li>
                  <li>• Configure proper NEXTAUTH_URL</li>
                  <li>• Set up SSL certificates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SMS Setup */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-purple-600" />
              <CardTitle>SMS Setup (Optional)</CardTitle>
            </div>
            <CardDescription>
              Configure Twilio for SMS notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  SMS notifications are optional. The waitlist works without SMS setup.
                </AlertDescription>
              </Alert>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">1. Create Twilio Account</h4>
                  <p className="text-sm text-gray-600">
                    Sign up at <a href="https://twilio.com" className="text-blue-600 hover:underline">twilio.com</a> and get your Account SID and Auth Token
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Get a Phone Number</h4>
                  <p className="text-sm text-gray-600">
                    Purchase a Twilio phone number for sending SMS
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. Add to Environment</h4>
                  <code className="block bg-gray-100 p-2 rounded text-sm">
                    TWILIO_ACCOUNT_SID=your_account_sid
                    <br />
                    TWILIO_AUTH_TOKEN=your_auth_token
                    <br />
                    TWILIO_PHONE_NUMBER=+1234567890
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-600">
            Need help? Check the documentation or create an issue on GitHub.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="outline">
              View Documentation
            </Button>
            <Button>
              Get Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}