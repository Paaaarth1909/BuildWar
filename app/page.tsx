import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Camera, CheckCircle2, FileText, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
          Report Traffic Violations for Safer Roads
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Help make our roads safer by reporting traffic violations. Your reports are sent directly to local traffic
          authorities for action.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/report">
            <Button size="lg" className="gap-2">
              <Camera className="h-5 w-5" />
              Report a Violation
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="gap-2">
              <FileText className="h-5 w-5" />
              View My Reports
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Capture Evidence</CardTitle>
              <CardDescription>Take photos or videos of traffic violations you witness</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Use your smartphone to safely capture evidence of traffic violations. Make sure to include the vehicle
                and its surroundings for context.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Submit Report</CardTitle>
              <CardDescription>Fill out a simple form with details about the violation</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Provide information about the violation, including location, time, and type. Your personal information
                remains confidential.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Authorities Take Action</CardTitle>
              <CardDescription>Traffic authorities review and act on valid reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Local traffic authorities receive your report, investigate the violation, and take appropriate action.
                You'll receive updates on the status.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Violation Types */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Common Traffic Violations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <AlertTriangle />, title: "Signal Jumping" },
            { icon: <AlertTriangle />, title: "Wrong-side Driving" },
            { icon: <AlertTriangle />, title: "Illegal Parking" },
            { icon: <AlertTriangle />, title: "Speeding" },
            { icon: <AlertTriangle />, title: "No Helmet/Seatbelt" },
            { icon: <AlertTriangle />, title: "Using Mobile While Driving" },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="text-primary">{item.icon}</div>
              <div className="font-medium">{item.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We take your privacy seriously. Here's how we protect your information:</p>
            <ul className="space-y-2 list-disc pl-5">
              <li>Your personal information is never shared with the public</li>
              <li>Only authorized traffic authorities can access your contact details</li>
              <li>All data is encrypted and stored securely</li>
              <li>You can choose to remain anonymous when submitting reports</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join thousands of citizens who are making our roads safer by reporting traffic violations.
        </p>
        <Link href="/report">
          <Button size="lg">Report a Violation Now</Button>
        </Link>
      </section>
    </div>
  )
}

