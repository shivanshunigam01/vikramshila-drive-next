import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";

export default function SimplePage({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <Helmet>
        <title>{title} | Vikramshila Automobiles</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`/${title.toLowerCase()}`}/>
      </Helmet>
      <Header />
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </main>
      <Footer />
    </div>
  );
}
