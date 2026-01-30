import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: 'mailto:contact@example.com', label: 'Email' },
  ];

  return (
    <footer className="py-12 px-4 bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Game Developer Portfolio
            </h3>
            <p className="text-gray-400">สร้างสรรค์เกมและประสบการณ์ดิจิตอล</p>
          </div>

          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-purple-500/50 rounded-lg transition-all duration-300"
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5 text-gray-400 hover:text-purple-400 transition-colors" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Game Developer Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
