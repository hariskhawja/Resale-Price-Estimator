"use client"

import { useState, useEffect } from "react"

type Category = "T-Shirt" | "Jacket" | "Long-Sleeves" | "Jeans" | "Shorts" | "Sweat Pants" | "Hoodie"
type Size = "XS" | "S" | "M" | "L" | "XL"
type Condition = "Excellent" | "Good" | "Decent" | "Poor"

type ClothingOutput = {
  category: Category,
  colour: string,
  size: Size,
  initial_price: number,
  current_price: number,
  time_since_purchase: number,
  condition: Condition
}

type ClothingInput = {
  category: Category,
  colour: string,
  size: Size,
  initial_price: number,
  time_since_purchase: number,
  condition: Condition
}

export default function Home() {
  const [data, setData] = useState<ClothingOutput[] | []>([])
  const [isLoading, setIsLoading] = useState(true)

  // GET Function
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/model")
        const result: ClothingOutput[] = await response.json()
        setData(result)
        console.log(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // POST Function
  const submitClothing = async () => {
    const newClothing = {
      category: "Shorts",
      colour: "Red",
      size: "M",
      initial_price: 49.99,
      time_since_purchase: 10,
      condition: "Good"
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newClothing)
      })

      if (!response.ok) {
        throw new Error("Failed to send data")
      }
      
      const result: ClothingOutput[] = await response.json()
      setData(result)
      console.log("Server response", response)
    } catch (error) {
      console.log("Error sending data:", error)
    }

  }

  // FOR DEBUGGING
  useEffect(() => {
    console.log(data)
  }, [data])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No data available</p>

  return (
    <div>
      {data.map((clothing, index) => (
        <p key={index}>{clothing.category}</p>
      ))}

      {/* <p>{data[0].category}</p> */}

      <button onClick={submitClothing}>POST</button>
    </div>
  )
}