import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createLead } from "@/services/leadService";
import { toast } from "sonner";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  images?: string[];
  brochureFile?: string;
}

interface FinanceData {
  vehiclePrice: number;
  downPaymentPercentage: number;
  downPaymentAmount: number;
  tenure: number;
  interestRate: number;
  loanAmount: number;
  estimatedEMI: number;
}

interface LocationState {
  product: Product;
  financeData: FinanceData;
}

function formatINR(n: number) {
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

export default function ReviewQuote() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const state = location.state as LocationState;

  // Redirect if no data is available
  if (!state || !state.product || !state.financeData) {
    return (
      <div className="bg-black min-h-screen text-white">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">No Quote Data Found</h1>
          <p className="text-gray-400 mb-6">
            Please select a product and configure finance options first.
          </p>
          <Button
            onClick={() => navigate("/products")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Go to Products
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const { product, financeData } = state;

  const handleSubmitLead = async () => {
    setIsSubmitting(true);

    try {
      const leadData = {
        productId: product._id,
        productTitle: product.title,
        productCategory: product.category,
        vehiclePrice: financeData.vehiclePrice,
        downPaymentPercentage: financeData.downPaymentPercentage,
        downPaymentAmount: financeData.downPaymentAmount,
        tenure: financeData.tenure,
        interestRate: financeData.interestRate,
        loanAmount: financeData.loanAmount,
        estimatedEMI: financeData.estimatedEMI,
        status: "pending",
      };

      const result = await createLead(leadData);

      if (result.success) {
        toast.success("Request submitted successfully!");
        navigate("/thank-you"); // ✅ redirect to Thank You page
      }
    } catch (error) {
      console.error("Failed to submit lead:", error);
      toast.error("Failed to submit quote. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Helmet>
        <title>Review Quote | Vikramshila Automobiles</title>
        <meta
          name="description"
          content="Review your vehicle quote before submission."
        />
      </Helmet>

      <Header />

      {/* Breadcrumb */}
      <div className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-400">
            <a href="/" className="hover:text-white">
              Home
            </a>
            <span className="mx-2">›</span>
            <a href="/products" className="hover:text-white">
              Products
            </a>
            <span className="mx-2">›</span>
            <span className="text-white">Review Quote</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Review Your Quote
            </h1>
            <p className="text-gray-400">
              Please review all details before submitting your quote
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Details Card */}
            <Card className="bg-gray-900 border border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Selected Vehicle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.images && product.images[0] && (
                  <div className="aspect-[4/3] bg-black rounded-lg overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">
                    {product.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{product.description}</p>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-700">
                    <div>
                      <p className="text-sm text-gray-400">Category</p>
                      <p className="font-medium text-white">
                        {product.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Vehicle Price</p>
                      <p className="font-medium text-white">{product.price}</p>
                    </div>
                  </div>

                  {product.brochureFile && (
                    <div className="pt-3">
                      <a
                        href={product.brochureFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                      >
                        View Brochure (PDF)
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Finance Details Card */}
            <Card className="bg-gray-900 border border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Finance Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Vehicle Price</p>
                    <p className="font-medium text-white">
                      {formatINR(financeData.vehiclePrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Down Payment</p>
                    <p className="font-medium text-white">
                      {formatINR(financeData.downPaymentAmount)} (
                      {financeData.downPaymentPercentage}%)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Loan Amount</p>
                    <p className="font-medium text-white">
                      {formatINR(financeData.loanAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Tenure</p>
                    <p className="font-medium text-white">
                      {financeData.tenure} months
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Interest Rate</p>
                    <p className="font-medium text-white">
                      {financeData.interestRate}% p.a.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Estimated EMI</p>
                    <p className="text-xl font-bold text-blue-400">
                      {formatINR(financeData.estimatedEMI)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">
                      Payment Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">
                          Total Amount Payable:
                        </span>
                        <span className="text-white font-medium">
                          {formatINR(
                            financeData.downPaymentAmount +
                              financeData.estimatedEMI * financeData.tenure
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Interest:</span>
                        <span className="text-white font-medium">
                          {formatINR(
                            financeData.estimatedEMI * financeData.tenure -
                              financeData.loanAmount
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Important Note */}
          <Card className="bg-yellow-900/20 border border-yellow-600/30 mt-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-yellow-400 mb-2">
                Important Note
              </h3>
              <p className="text-sm text-gray-300">
                This is an estimated quote based on the information provided.
                Final terms and conditions may vary based on documentation,
                credit approval, and bank policies. Our team will contact you
                shortly to discuss further details and finalize your
                application.
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 justify-center">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="px-8 py-3 bg-white text-black border border-gray-300 hover:bg-gray-200"
            >
              Go Back
            </Button>
            <Button
              onClick={handleSubmitLead}
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting Quote...
                </div>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>

          {/* Contact Info */}
          <div className="text-center mt-8 p-6 bg-gray-900 rounded-lg border border-gray-800">
            <h3 className="font-semibold text-white mb-2">Need Help?</h3>
            <p className="text-sm text-gray-400 mb-3">
              Have questions about this quote? Our team is here to help.
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <div>
                <p className="text-gray-400">Call us:</p>
                <p className="text-blue-400 font-medium">+91 8406991610</p>
              </div>
              <div>
                <p className="text-gray-400">Email us:</p>
                <p className="text-blue-400 font-medium">
                  info@vikramshila.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
