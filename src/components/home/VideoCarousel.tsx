import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { videos } from "@/data/products";

export default function VideoCarousel() {
  return (
    <section className="w-full bg-black py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <header className="mb-10 text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Videos</h2>
          <p className="text-gray-400 mt-2">
            Walkthroughs, testimonials, and dealer insights
          </p>
        </header>

        {/* Horizontal Scroll Video Thumbnails */}
        <div className="flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {videos.map((v) => (
            <Dialog key={v.id}>
              <DialogTrigger asChild>
                <button className="min-w-[280px] md:min-w-[360px] rounded-xl overflow-hidden bg-[#1e2125] border border-gray-800 shadow-lg hover:shadow-xl transition duration-300 text-left">
                  {/* Thumbnail */}
                  <div className="relative aspect-video">
                    <img
                      src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                      alt={`${v.title} video thumbnail`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 grid place-items-center">
                      <span className="px-3 py-1 rounded-full bg-blue-600/80 text-white text-xs font-medium">
                        ▶ Play
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="p-3 text-sm text-gray-300 font-medium">
                    {v.title}
                  </div>
                </button>
              </DialogTrigger>

              {/* Video Modal */}
              <DialogContent className="max-w-4xl p-2 bg-black border border-gray-800">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
}
