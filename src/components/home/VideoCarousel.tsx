import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { videos } from "@/data/products";

export default function VideoCarousel() {
  return (
    <section className="container mx-auto py-10">
      <header className="mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">Videos</h2>
        <p className="text-muted-foreground">Walkthroughs, testimonials, and dealer insights</p>
      </header>
      <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {videos.map((v) => (
          <Dialog key={v.id}>
            <DialogTrigger asChild>
              <button className="min-w-[280px] md:min-w-[360px] rounded-lg overflow-hidden hover-scale shadow-elegant text-left">
                <div className="relative aspect-video">
                  <img src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`} alt={`${v.title} video thumbnail`} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="px-3 py-1 rounded-full bg-black/60 text-white text-xs">Play</span>
                  </div>
                </div>
                <div className="p-3 text-sm">{v.title}</div>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-2">
              <div className="aspect-video">
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${v.id}`} title={v.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </section>
  );
}
