"use client"

import { useState, useEffect, useRef } from "react"
import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownIcon, ArrowUpIcon, DollarSignIcon, ShirtIcon, CheckCircle2, Users, User, ArrowRightIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Category = "T-Shirt" | "Jacket" | "Long-Sleeves" | "Jeans" | "Shorts" | "Sweat Pants" | "Hoodie"
type Size = "XS" | "S" | "M" | "L" | "XL"
type Condition = "Excellent" | "Good" | "Decent" | "Poor"
type Rarity = "General Release" | "Limited Edition" | "Collaboration" | "Vintage"
type Fit = "Slim" | "Regular" | "Oversized" | "Relaxed"
type Material =
  | "Cotton"
  | "Polyester"
  | "Nylon"
  | "Wool"
  | "Denim"
  | "Leather"
  | "Fleece"
  | "Silk"
  | "Linen"
  | "Rayon"
  | "Spandex"
  | "Acrylic"
  | "Cashmere"
  | "Suede"
  | "Velvet"
  | "Other"


type ClothingOutput = {
  id: string
  category: Category
  colour: string
  size: Size
  initial_price: number
  current_price: number
  age_in_months: number
  condition: Condition
  user: string
  brand: string
  rarity: Rarity
  fit: Fit
  material: Material
}

type ClothingInput = {
  category: Category
  colour: string
  size: Size
  initial_price: number
  age_in_months: number
  condition: Condition
  user: string
  brand: string
  rarity: Rarity
  fit: Fit
  material: Material
}

function ItemStatsDiv({ label, value }: { label: string, value: any }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-base">
        {value}
      </p>
    </div>
  )
}

export default function Home() {
  const [yourName, setYourName] = useState<string>("")
  const [nameInput, setNameInput] = useState<string>("")

  const [data, setData] = useState<ClothingOutput[] | []>([]) // All data
  const [yourData, setYourData] = useState<ClothingOutput[] | []>([]) // Your data
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastSubmitted, setLastSubmitted] = useState<ClothingOutput | null>(null)
  const lastSubmittedRef = useRef<HTMLDivElement>(null)

  // Form state
  const [formData, setFormData] = useState<ClothingInput>({
    category: "T-Shirt",
    colour: "Black",
    size: "M",
    initial_price: 50,
    age_in_months: 0,
    condition: "Good",
    user: yourName,
    brand: "Unknown",
    rarity: "General Release",
    fit: "Regular",
    material: "Other"
  })

  // GET Function
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/model")
        const result: ClothingOutput[][] = await response.json()
        const [ allClothing, yourClothing ] = result
        setData(allClothing) // All data
        setYourData(yourClothing) // Your data
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // POST Function
  const submitClothing = async (newClothing: ClothingInput) => {
    try {
      setIsSubmitting(true)
      newClothing["user"] = yourName
      const response = await fetch("http://127.0.0.1:5000/api/model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClothing),
      })

      if (!response.ok) {
        throw new Error("Failed to send data")
      }

      const result: ClothingOutput[][] = await response.json()
      const [ allClothing, yourClothing ] = result
      setData(allClothing) // All data
      setYourData(yourClothing) // Your data

      // Set the last submitted item (assuming the newest item is the first in the array)
      if (yourClothing.length > 0) {
        setLastSubmitted(yourClothing[yourClothing.length-1])
      }

      // Show success animation
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)

      console.log("Server response", response)
    } catch (error) {
      console.log("Error sending data:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Scroll to last submitted item
  useEffect(() => {
    if (lastSubmitted && lastSubmittedRef.current) {
      lastSubmittedRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [lastSubmitted])

  // Form handlers
  const handleInputChange = (field: keyof ClothingInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      user: yourName
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitClothing(formData)
  }

  const getConditionColour = (condition: Condition) => {
    switch (condition) {
      case "Excellent":
        return "bg-green-500"
      case "Good":
        return "bg-emerald-500"
      case "Decent":
        return "bg-amber-500"
      case "Poor":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "CAD",
    }).format(value)
  }

  const handleUser = (e: React.FormEvent) => {
    e.preventDefault()
    setYourName(nameInput)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.1,
        staggerDirection: -1,
        duration: 0.4,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  }

  if (!yourName)
    return (
      <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="p-8">
          <motion.div className="flex justify-center mb-6 mt-2" variants={itemVariants}>
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
              <ShirtIcon className="h-10 w-10 text-gray-600" />
            </div>
          </motion.div>

          <motion.h1 className="text-2xl font-bold text-center text-gray-800 mb-2" variants={itemVariants}>
            Welcome to the Global Clothing Value Estimator
          </motion.h1>

          <motion.p className="text-gray-500 text-center mb-8" variants={itemVariants}>
            Find the current market value of your clothing items!
          </motion.p>

          <motion.form onSubmit={handleUser} className="space-y-6" variants={itemVariants}>
            <div className="space-y-2">
              <Label htmlFor="user" className="text-gray-700 font-medium">
                What should we call you?
              </Label>
              <Input
                id="user"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="John Doe"
                className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Getting things ready..."
                ) : (
                  <>
                    Continue to Dashboard
                    <ArrowRightIcon className="h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>

          <motion.p className="text-gray-400 text-center text-xs mt-6" variants={itemVariants}>
            Your personal clothing valuation assistant
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  )

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )

  if (!data)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No data available</p>
      </div>
    )

  return (
    <motion.div
    className="min-h-screen bg-gray-50"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 text-center">Global Clothing Value Estimator</h1>
          <p className="text-gray-500 text-lg mt-2 text-center">Find the current market value of your clothing items, all in one spot!</p>
        </header>

        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="form">Submit Item</TabsTrigger>
            <TabsTrigger value="results">User History</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <Card className="mb-8 border-gray-200 shadow-sm pt-0 hover:scale-101 hover:shadow-2xl transition-all duration-300 ease-in-out">
              <CardHeader className="bg-slate-900 text-gray-200 rounded-t-xl py-4">
                <CardTitle>Item Details</CardTitle>
                <CardDescription className="text-gray-400">
                  Enter the details of your clothing item to estimate its current value.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleInputChange("category", value as Category)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {["T-Shirt", "Jacket", "Long-Sleeves", "Hoodie", 
                          "Jeans", "Shorts", "Sweat Pants"
                          ].map((article, index) => (
                            <SelectItem key={index} value={article}>{article}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => handleInputChange("brand", e.target.value)}
                        placeholder="Enter brand"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rarity">Rarity</Label>
                      <Select
                        value={formData.rarity}
                        onValueChange={(value) => handleInputChange("rarity", value as Rarity)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rarity" />
                        </SelectTrigger>
                        <SelectContent>
                          {["General Release", "Limited Edition", 
                          "Collaboration", "Vintage"
                          ].map((selectRarity, index) => (
                            <SelectItem key={index} value={selectRarity}>{selectRarity}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="material">Material</Label>
                      <Select
                        value={formData.material}
                        onValueChange={(value) => handleInputChange("material", value as Material)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Cotton", "Polyester", "Nylon", "Wool", "Denim", "Leather",
                            "Fleece", "Silk", "Linen", "Rayon", "Spandex", "Acrylic",
                            "Cashmere", "Suede", "Velvet", "Other"
                          ].map((material, index) => (
                            <SelectItem key={index} value={material}>{material}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="colour">Colour</Label>
                      <Input
                        id="colour"
                        value={formData.colour}
                        onChange={(e) => handleInputChange("colour", e.target.value)}
                        placeholder="Enter colour"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fit">Fit</Label>
                      <Select
                        value={formData.fit}
                        onValueChange={(value) => handleInputChange("fit", value as Category)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select fit" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Slim", "Regular", 
                          "Oversized", "Relaxed"
                          ].map((fitSelect, index) => (
                            <SelectItem key={index} value={fitSelect}>{fitSelect}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="size">Size</Label>
                      <Select value={formData.size} onValueChange={(value) => handleInputChange("size", value as Size)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {["XS", "S", "M",
                          "L", "XL"
                          ].map((sizeSelect, index) => (
                            <SelectItem key={index} value={sizeSelect}>{sizeSelect}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Select
                        value={formData.condition}
                        onValueChange={(value) => handleInputChange("condition", value as Condition)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Excellent", "Good", 
                          "Decent", "Poor"
                          ].map((conditionSelect, index) => (
                            <SelectItem key={index} value={conditionSelect}>{conditionSelect}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <Label htmlFor="initial_price">Initial Price: {formatCurrency(formData.initial_price)}</Label>
                      </div>
                      <Slider
                        id="initial_price"
                        min={1}
                        max={500}
                        step={1}
                        value={[formData.initial_price]}
                        onValueChange={(value) => handleInputChange("initial_price", value[0])}
                        className="bg-slate-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age_in_months">Time Since Purchase (months)</Label>
                      <Input
                        id="age_in_months"
                        type="number"
                        min={0}
                        value={formData.age_in_months}
                        onChange={(e) => handleInputChange("age_in_months", Number.parseInt(e.target.value) || 0)}
                        placeholder="Enter months"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-700" disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Calculate Current Value"}
                    </Button>

                    <AnimatePresence>
                      {showSuccess && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.div
                            className="flex items-center gap-2 text-green-600"
                            initial={{ y: 10 }}
                            animate={{ y: 0 }}
                          >
                            <CheckCircle2 className="h-6 w-6" />
                            <span className="font-medium">Submission successful!</span>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              </CardContent>
            </Card>

            {lastSubmitted && (
              <div ref={lastSubmittedRef}>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Your Latest Submission</h2>
                <Card className="overflow-hidden mb-8 border-gray-200 shadow-md p-0 hover:scale-101 hover:shadow-2xl transition-all duration-300 ease-in-out">
                  <CardHeader className="bg-slate-900 pb-4 border-b text-gray-200">
                    <div className="flex justify-between items-start pt-8">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <ShirtIcon className="h-6 w-6" />
                          {lastSubmitted.category}
                        </CardTitle>
                        <CardDescription className="mt-1 text-base text-gray-200">
                          {lastSubmitted.brand} · {lastSubmitted.rarity}
                        </CardDescription>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-md font-medium ${getConditionColour(lastSubmitted.condition)} bg-opacity-10 text-white`}
                      >
                        {lastSubmitted.condition} Condition
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 pb-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Initial Price</p>
                        <p className="text-xl font-semibold flex items-center">
                          <DollarSignIcon className="h-5 w-5 mr-1 text-gray-400" />
                          {formatCurrency(lastSubmitted.initial_price).replace("$", "")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Current Value</p>
                        <p className="text-xl font-semibold flex items-center">
                          <DollarSignIcon className="h-5 w-5 mr-1 text-gray-400" />
                          {formatCurrency(lastSubmitted.current_price).replace("$", "")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Age</p>
                        <p className="text-lg">
                          {lastSubmitted.age_in_months} {lastSubmitted.age_in_months === 1 ? "month" : "months"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Value Change</p>
                        <p
                          className={`text-lg font-medium flex items-center ${
                            lastSubmitted.current_price < lastSubmitted.initial_price
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {lastSubmitted.current_price < lastSubmitted.initial_price ? (
                            <ArrowDownIcon className="h-5 w-5 mr-1" />
                          ) : (
                            <ArrowUpIcon className="h-5 w-5 mr-1" />
                          )}
                          {Math.abs(
                            ((lastSubmitted.current_price - lastSubmitted.initial_price) /
                              lastSubmitted.initial_price) *
                              100,
                          ).toFixed(1)}
                          %
                        </p>
                      </div>

                        <ItemStatsDiv label={"Material"} value={lastSubmitted.material} />
                        <ItemStatsDiv label={"Colour"} value={lastSubmitted.colour} />
                        <ItemStatsDiv label={"Size"} value={lastSubmitted.size} />
                        <ItemStatsDiv label={"Fit"} value={lastSubmitted.fit} />
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-900 border-t py-3 pb-6">
                    <p className="text-sm text-gray-200 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Your personal valuation
                    </p>
                  </CardFooter>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="results">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800 text-center">User History</h2>
              <p className="text-gray-500 text-center">See your past inquiries, organised here just for you!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <p className="text-gray-500">Loading items...</p>
                </div>
              ) : data.length === 0 ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <p className="text-gray-500">No items available. Submit an item to see results.</p>
                </div>
              ) : (
                yourData.reverse().map((item, index) => (
                  <Card key={index} className="overflow-hidden border-gray-200 shadow-sm p-0 pb-13 hover:scale-103 hover:shadow-2xl transition-all duration-300 ease-in-out">
                    <CardHeader className="pb-2 border-b bg-slate-900 text-gray-200">
                      <div className="flex justify-between items-start pt-5">
                        <div>
                          <CardTitle className="flex items-center gap-2 pt-4">
                            <ShirtIcon className="h-5 w-5" />
                            {item.category}
                          </CardTitle>
                          <CardDescription className="mt-1 text-gray-200">
                            {item.brand} · {item.rarity}
                          </CardDescription>
                        </div>
                        <span
                          className={`px-2 py-1 mt-4 rounded-full text-xs font-medium ${getConditionColour(item.condition)} bg-opacity-10 text-white`}
                        >
                          {item.condition} Condition
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Initial Price</p>
                          <p className="text-lg font-semibold flex items-center">
                            <DollarSignIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {formatCurrency(item.initial_price).replace("$", "")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Current Value</p>
                          <p className="text-lg font-semibold flex items-center">
                            <DollarSignIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {formatCurrency(item.current_price).replace("$", "")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Age</p>
                          <p className="text-base">
                            {item.age_in_months} {item.age_in_months === 1 ? "month" : "months"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Value Change</p>
                          <p
                            className={`text-base font-medium flex items-center ${
                              item.current_price < item.initial_price ? "text-red-500" : "text-green-500"
                            }`}
                          >
                            {item.current_price < item.initial_price ? (
                              <ArrowDownIcon className="h-4 w-4 mr-1" />
                            ) : (
                              <ArrowUpIcon className="h-4 w-4 mr-1" />
                            )}
                            {Math.abs(((item.current_price - item.initial_price) / item.initial_price) * 100).toFixed(
                              1,
                            )}
                            %
                          </p>
                        </div>
                        
                        <ItemStatsDiv label={"Material"} value={item.material}/>
                        <ItemStatsDiv label={"Colour"} value={item.colour}/>
                        <ItemStatsDiv label={"Size"} value={item.size}/>
                        <ItemStatsDiv label={"Fit"} value={item.fit}/>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800 text-center">Global Market Insights</h2>
              <p className="text-gray-500 text-center">Explore what other users are inquiring about in the clothing market!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <p className="text-gray-500">Loading global market data...</p>
                </div>
              ) : data.length === 0 ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <p className="text-gray-500">No global market data available.</p>
                </div>
              ) : (
                data.reverse().map((item, index) => (
                  <Card key={index} className="overflow-hidden border-gray-200 shadow-sm p-0 hover:scale-103 hover:shadow-2xl transition-all duration-300 ease-in-out">
                    <CardHeader className="bg-gray-50 border-b bg-slate-900 text-gray-200">
                      <div className="flex justify-between items-start pt-5">
                        <div>
                          <CardTitle className="flex items-center gap-2 pt-4">
                            <ShirtIcon className="h-5 w-5" />
                            {item.category}
                          </CardTitle>
                          <CardDescription className="mt-1 text-gray-200">
                            {item.brand} · {item.rarity}
                          </CardDescription>
                        </div>
                        <span
                          className={`px-2 py-1 mt-4 rounded-full text-xs font-medium ${getConditionColour(item.condition)} bg-opacity-10 text-white`}
                        >
                          {item.condition} Condition
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="py-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Initial Price</p>
                          <p className="text-lg font-semibold flex items-center">
                            <DollarSignIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {formatCurrency(item.initial_price).replace("$", "")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Current Value</p>
                          <p className="text-lg font-semibold flex items-center">
                            <DollarSignIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {formatCurrency(item.current_price).replace("$", "")}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Age</p>
                          <p className="text-base">
                            {item.age_in_months} {item.age_in_months === 1 ? "month" : "months"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Value Change</p>
                          <p
                            className={`text-base font-medium flex items-center ${
                              item.current_price < item.initial_price ? "text-red-500" : "text-green-500"
                            }`}
                          >
                            {item.current_price < item.initial_price ? (
                              <ArrowDownIcon className="h-4 w-4 mr-1" />
                            ) : (
                              <ArrowUpIcon className="h-4 w-4 mr-1" />
                            )}
                            {Math.abs(((item.current_price - item.initial_price) / item.initial_price) * 100).toFixed(
                              1,
                            )}
                            %
                          </p>
                        </div>
                        <ItemStatsDiv label={"Material"} value={item.material}/>
                        <ItemStatsDiv label={"Colour"} value={item.colour}/>
                        <ItemStatsDiv label={"Size"} value={item.size}/>
                        <ItemStatsDiv label={"Fit"} value={item.fit}/>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t py-6 bg-slate-900">
                      <p className="text-sm text-gray-200 flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {item.user}
                      </p>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
}