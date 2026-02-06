import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PenTool, FileText, Share2 } from 'lucide-react';
import Slider from "react-slick";

const designs = [
  {
    id: 1,
    title: 'GDD: Chronicles of the New World',
    category: 'Game Design',
    image:
      'https://images.unsplash.com/photo-1721244654346-9be0c0129e36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'คิด Core GamePlay Loop, Player System, Economy System',
    docLink: "https://docs.google.com/document/d/180ySo7EdwH3fHVToOHFGZh3garB1UMulCyG3oTfhTv4/edit?usp=sharing"
  },
  {
    id: 2,
    title: 'GDD: I'm Just a Merchant',
    category: 'Game Design',
    image:
      'https://images.unsplash.com/photo-1558655146-d09347e0b7a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'ออกแบบแมพ และการวาง Event ให้ผู้เล่น interact ได้ดี',
    docLink: "https://docs.google.com/document/d/1Lm-YB53TiOfpqpFSfb5vh0wnZSyVyDp2vW6DbV7zmZw/edit?usp=sharing"
  },
  {
    id: 3,
    title: 'Character Progression',
    category: 'Economy Design',
    image:
      'https://images.unsplash.com/photo-1553484771-371af2727871?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'ออกแบบระบบเนื้อเรื่อง การให้รางวัล และการเติบโตของตัวละคร',
    docLink: "https://example.com/progression.pdf"
  },
  {
    id: 4,
    title: 'Boss Mechanics',
    category: 'Combat Design',
    image:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'ออกแบบการเปลี่ยน Phase ของ Boss และรูปแบบการโจมตี',
    docLink: "https://example.com/boss-mechanics.pdf"
  }
];

export function GameDesignSection() {

  // Hybrid Slider Settings (Auto + Swipe Smooth)
  const settings = {
    dots: false,
    infinite: true,

    slidesToShow: 3,
    slidesToScroll: 1,

    // Hybrid Auto Slide
    autoplay: true,
    autoplaySpeed: 2500, // หยุดนิดก่อนเลื่อน
    speed: 800,          // ความเร็วตอนเลื่อน
    cssEase: "ease-in-out",

    //  Swipe / Drag Smooth
    swipeToSlide: true,
    draggable: true,
    touchMove: true,
    touchThreshold: 8,

    pauseOnHover: true,

    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <section className="py-20 px-4 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
            <PenTool className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400">Game Design</span>
          </div>

          <h2 className="text-5xl font-bold mb-4">การออกแบบเกม</h2>
          <p className="text-gray-400 text-lg">
            เอกสารการออกแบบ ระบบเกม และเลเวลดีไซน์
          </p>
        </motion.div>

        {/* Slider */}
        <Slider {...settings} className="game-design-slider -mx-4">
          {designs.map((item) => (
            <div key={item.id} className="px-4 outline-none">

              <div className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300">

                {/* Image */}
                <div className="h-48 overflow-hidden relative">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 relative">

                  {/* Icon */}
                  <div className="absolute -top-10 right-6 p-3 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
                    <FileText className="w-6 h-6 text-purple-400" />
                  </div>

                  <span className="text-sm text-purple-400 font-medium">
                    {item.category}
                  </span>

                  <h3 className="text-xl font-bold mt-2 mb-3">
                    {item.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/*  View Document Link */}
                  <a
                    href={item.docLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-purple-400 transition-colors"
                  >
                    <span>View Document</span>
                    <Share2 className="w-4 h-4" />
                  </a>

                </div>
              </div>
            </div>
          ))}
        </Slider>

      </div>
    </section>
  );
}
