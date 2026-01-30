import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Facebook, Instagram, MessageCircle, User, X } from 'lucide-react';

export function ContactMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const contactItems = [
    {
      id: 'email',
      icon: Mail,
      label: 'Email',
      value: 'nonomxp80@gmail.com',
      link: 'mailto:nonomxp80@gmail.com',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20'
    },
    {
      id: 'facebook',
      icon: Facebook,
      label: 'Facebook',
      value: 'My Facebook Profile',
      link: 'https://www.facebook.com/share/1DWsRzefku/?mibextid=wwXIfr',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      id: 'instagram',
      icon: Instagram,
      label: 'Instagram',
      value: '@my_portfolio',
      link: 'https://www.instagram.com/black_ark47?igsh=OWlncDdnOHhndTU1&utm_source=qr',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20'
    },
    {
      id: 'line',
      icon: MessageCircle,
      label: 'Line',
      value: 'ID: my_line_id',
      link: null, // No link for Line as requested
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    }
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed top-6 left-6 z-[60] p-3 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <User className="w-6 h-6" />}
      </motion.button>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-20 left-6 z-[60] w-72 bg-gray-900/95 backdrop-blur-xl border border-gray-700 p-4 rounded-2xl shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4 text-white px-2">Contact Me</h3>
            <div className="space-y-3">
              {contactItems.map((item) => {
                const ItemWrapper = item.link ? 'a' : 'div';
                const wrapperProps = item.link 
                  ? { 
                      href: item.link, 
                      target: item.id === 'email' ? undefined : '_blank',
                      rel: item.id === 'email' ? undefined : 'noopener noreferrer'
                    } 
                  : {};

                return (
                  <ItemWrapper
                    key={item.id}
                    {...wrapperProps}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl border transition-all duration-200
                      ${item.bgColor} ${item.borderColor}
                      ${item.link ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
                    `}
                  >
                    <div className={`p-2 rounded-lg bg-black/20 ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={`text-xs font-medium opacity-60 ${item.color}`}>
                        {item.label}
                      </div>
                      <div className="text-sm font-semibold text-gray-200">
                        {item.value}
                      </div>
                    </div>
                  </ItemWrapper>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
