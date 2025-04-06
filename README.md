# Global Clothing Value Estimator

Welcome to the **Global Clothing Value Estimator**! This is a full-stack web application built using Next.js, Flask, Supabase, OpenAI, TypeScript, and Tailwind CSS. It helps users with estimating the current market value of their clothes using a custom multi-variable **Declining Balance Model** and **OpenAI's GPT-3.5-turbo's** qualitative analysis on clothing conditions.

## Vercel Website
Link: https://resale-price-estimator.vercel.app/

## Features
- **User-Driven:** Jump in with a desired username, see your past inquiries, and automatically post market value updates to the global community
- **Multi-Variable Input:** Provide basic to intricate details regarding your clothing article for a more unique and precise estimate
- **Advanced Market Value Estimation:** Current market prices calculated using a custom multi-variable Declining Balance Model
- **AI/ML Insider Analytics:** Users receive qualitative analysis on their clothes from OpenAI's GPT-3.5-turbo model to estimate prices
- **Global Insights:** View inquiries, clothing estimates, and buy-sell opportunities from users around the world in real-time
- **Superior UI/UX:** Clean and modern frontend design using ShadCN and Lucide React, with Framer Motion for animations and effects

## Project Approach

### Frontend
- Designed using Next.js, TypeScript, and Tailwind CSS
- API requests made through `fetch()`
- Form inputs tracked through `useState()` and updated via `useEffect()`
- Loading and error states handled using event promises

### Backend
- Custom API `api/model` endpoint designed with Flask
- Supabase database used to save clothing inquiries on the cloud
- OpenAI's GPT-3.5-turbo used to provide qualitative analysis on a user's clothing article to produce estimates
- Custom multi-variable Declining Balance Model used to estimate current market value of clothing article based on user-inputted details (e.g. brand, material, age, etc.)
  - Dictionaries store common or constrained clothing properties
  - Each clothing property has several dictionaries of varying factor scores that uniquely adjust the new resell value (e.g. luxury brands have a high factor, fast-fashion brands have a low factor)
  - Factors were derived from https://zenodo.org/records/8386668 and https://www.kaggle.com/c/mercari-price-suggestion-challenge/data
  - Final function to estimate current market value: `Market Value = Initial_Price((Brand_Factor)(Category_Factor)(Condition_Factor)(Material_Factor)(Rarity_Factor)**(Age_in_Months/12))`
  
## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (package manager)

## Getting Started

Follow these steps to get your development environment set up:

### 1. Clone the Repository

```bash
git clone https://github.com/hariskhawja/Resale-Price-Estimator.git
cd resale-price-estimator
```

### 2. Install dependencies

```bash
cd client
npm i --force
```

then

```bash
cd ../backend
pip install requirements.txt
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root directory, then insert:
```bash
PORT=5000
SUPABASE_URL="your-supabase-url"
SUPABASE_API_KEY="your-supabase-api-key"
OPENAI_API_KEY="your-openai-api-key"
```

### 4. Run the Development Server
Note: refer to previous commands to start this step in `/backend`

```bash
python app.py
cd ../client
npm run dev
```

## Demo Video

