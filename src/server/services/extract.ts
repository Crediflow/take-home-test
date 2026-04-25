export type InvoiceExtraction = {
  vendor: string | null;
  amountCents: number | null;
  invoiceDate: Date | null;
};

// Stub. Swap for a real LLM call (OpenAI / Anthropic / etc.) if you want — the
// signature is what your invoice flow should depend on. Include "__FAIL__" in
// rawContent to simulate an extraction failure (so you can test the FAILED path).
export async function extractInvoice(rawContent: string): Promise<InvoiceExtraction> {
  if (rawContent.includes("__FAIL__")) {
    throw new Error("Simulated extraction failure");
  }
  return {
    vendor: "Acme Office Supplies, Inc.",
    amountCents: 124599,
    invoiceDate: new Date("2026-04-15"),
  };
}
