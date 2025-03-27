"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Upload, MapPin, X } from "lucide-react"

interface Category {
  id: number
  name: string
}

export function ViolationForm({ categories }: { categories: Category[] }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [location, setLocation] = useState({ lat: 0, lng: 0, address: "" })
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles([...files, ...newFiles])

      // Create previews
      newFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviews((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const getLocation = () => {
    setIsGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          // Try to get address from coordinates
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            )
            const data = await response.json()
            setLocation({
              lat,
              lng,
              address: data.display_name || "",
            })
          } catch (error) {
            setLocation({
              lat,
              lng,
              address: "",
            })
          }
          setIsGettingLocation(false)
        },
        (error) => {
          setError("Error getting location: " + error.message)
          setIsGettingLocation(false)
        },
      )
    } else {
      setError("Geolocation is not supported by this browser.")
      setIsGettingLocation(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const categoryId = formData.get("category") as string
    const violationDate = formData.get("date") as string
    const violationTime = formData.get("time") as string
    const description = formData.get("description") as string
    const plateNumber = formData.get("plateNumber") as string

    if (!categoryId || !violationDate || !violationTime || files.length === 0 || location.lat === 0) {
      setError("Please fill all required fields and upload at least one photo/video")
      setLoading(false)
      return
    }

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("You must be logged in to report a violation")
        setLoading(false)
        return
      }

      // Create violation record
      const { data: violation, error: violationError } = await supabase
        .from("violations")
        .insert({
          user_id: user.id,
          category_id: Number.parseInt(categoryId),
          location_lat: location.lat,
          location_lng: location.lng,
          location_address: location.address,
          violation_date: `${violationDate}T${violationTime}:00`,
          description,
          plate_number: plateNumber,
          status: "pending",
        })
        .select()
        .single()

      if (violationError) {
        throw violationError
      }

      // Upload files
      for (const file of files) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `${user.id}/${violation.id}/${fileName}`

        const { error: uploadError } = await supabase.storage.from("violation-evidence").upload(filePath, file)

        if (uploadError) {
          throw uploadError
        }

        // Get public URL
        const { data: publicURL } = supabase.storage.from("violation-evidence").getPublicUrl(filePath)

        // Save media record
        const { error: mediaError } = await supabase.from("violation_media").insert({
          violation_id: violation.id,
          media_url: publicURL.publicUrl,
          media_type: file.type.startsWith("image/") ? "image" : "video",
        })

        if (mediaError) {
          throw mediaError
        }
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error: any) {
      setError(error.message || "An error occurred while submitting your report")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Report Submitted Successfully</CardTitle>
          <CardDescription>
            Thank you for reporting this violation. Your report has been submitted and will be reviewed by the
            authorities.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push("/dashboard")}>View My Reports</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Report a Traffic Violation</CardTitle>
        <CardDescription>
          Provide details about the traffic violation you witnessed. Your identity will be protected.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="category">Violation Type *</Label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select violation type" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date of Violation *</Label>
              <Input type="date" id="date" name="date" max={new Date().toISOString().split("T")[0]} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time of Violation *</Label>
              <Input type="time" id="time" name="time" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                id="location"
                name="location"
                value={location.address}
                onChange={(e) => setLocation({ ...location, address: e.target.value })}
                placeholder="Address of the violation"
                className="flex-1"
                required
                readOnly={location.lat !== 0}
              />
              <Button type="button" variant="outline" onClick={getLocation} disabled={isGettingLocation}>
                <MapPin className="h-4 w-4 mr-2" />
                {isGettingLocation ? "Getting..." : "Get Location"}
              </Button>
            </div>
            {location.lat !== 0 && (
              <p className="text-sm text-muted-foreground">
                Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="plateNumber">Vehicle Plate Number (if visible)</Label>
            <Input type="text" id="plateNumber" name="plateNumber" placeholder="E.g., ABC-1234" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe what happened, including vehicle details, driver description, etc."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Evidence (Photos/Videos) *</Label>
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*"
                multiple
              />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="mx-auto">
                <Upload className="h-4 w-4 mr-2" />
                Upload Evidence
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Upload photos or videos of the violation. Max 5 files.
              </p>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview || "/placeholder.svg"}
                      alt={`Preview ${index}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-medium mb-2">Privacy Notice</h4>
            <p className="text-sm text-muted-foreground">
              Your personal information will be kept confidential. Only the violation details and evidence will be
              shared with traffic authorities.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

