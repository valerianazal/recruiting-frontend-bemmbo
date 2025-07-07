interface Invoice {
  id: string
  receiverName: string
  amount: number
  currency: "CLP" | "USD"
  injected?: boolean
}

export type { Invoice };