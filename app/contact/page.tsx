"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would handle form submission here
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#f0f9f0] dark:bg-[#0a1f0a] py-16 md:py-24">
        <div className="container">
          <div className="max-w-[800px] mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
            <p className="text-xl text-muted-foreground">Have questions or feedback? We'd love to hear from you.</p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you have a question about our platform, need help with a specific algorithm, or want to provide
                feedback, we're here to help.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#f0f9f0] dark:bg-[#0a1f0a] flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-[#4ade80]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Email</h3>
                    <p className="text-muted-foreground">imtiaztanveer07@gmail.com</p>
                    <p className="text-muted-foreground">support@graphalgo.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#f0f9f0] dark:bg-[#0a1f0a] flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-[#4ade80]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Phone</h3>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-muted-foreground">Mon-Fri, 9am-5pm EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#f0f9f0] dark:bg-[#0a1f0a] flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-[#4ade80]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Location</h3>
                    <p className="text-muted-foreground">123 Algorithm Avenue</p>
                    <p className="text-muted-foreground">San Francisco, CA 94103</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Card className="border border-[#4ade80]/20">
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you soon.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Your email" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="What is this regarding?" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Your message" rows={5} className="resize-none" required />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#4ade80] hover:bg-[#22c55e] text-white"
                      disabled={submitted}
                    >
                      {submitted ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" /> Message Sent
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-[#f0f9f0] dark:bg-[#0a1f0a]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
              Find answers to common questions about our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1000px] mx-auto">
            <Card className="bg-white dark:bg-card">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">Is GraphAlgo free to use?</h3>
                <p className="text-muted-foreground">
                  Yes, GraphAlgo is completely free for educational purposes. We believe in making algorithm learning
                  accessible to everyone.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">Can I suggest a new algorithm?</h3>
                <p className="text-muted-foreground">
                  We're always looking to expand our collection. Please use the contact form to send us your
                  suggestions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">Do you offer educational discounts?</h3>
                <p className="text-muted-foreground">
                  We offer special packages for educational institutions. Please contact us for more information about
                  our educational partnerships.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">How can I report a bug?</h3>
                <p className="text-muted-foreground">
                  If you encounter any issues, please use the contact form to report them. Include as much detail as
                  possible to help us fix the problem quickly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
