import Link from 'next/link'
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react'

type Props = {
  siteName: string
  tagline?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  socials?: { facebook?: string | null; instagram?: string | null; youtube?: string | null }
}

export function Footer({ siteName, tagline, phone, email, address, socials }: Props) {
  return (
    <footer className="mt-20 bg-ink text-slate-300">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="text-xl font-extrabold text-white">
            NMT<span className="text-accent-500"> Holidays</span>
          </div>
          {tagline && <p className="mt-3 text-sm text-slate-400">{tagline}</p>}
          <div className="mt-4 flex gap-3">
            {socials?.facebook && (
              <a href={socials.facebook} aria-label="Facebook" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
                <Facebook size={18} />
              </a>
            )}
            {socials?.instagram && (
              <a href={socials.instagram} aria-label="Instagram" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
                <Instagram size={18} />
              </a>
            )}
            {socials?.youtube && (
              <a href={socials.youtube} aria-label="YouTube" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
                <Youtube size={18} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/tours" className="hover:text-white">Tour Packages</Link></li>
            <li><Link href="/destinations" className="hover:text-white">Destinations</Link></li>
            <li><Link href="/blog" className="hover:text-white">Travel Blog</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link href="/tours?theme=honeymoon" className="hover:text-white">Honeymoon Packages</Link></li>
            <li><Link href="/tours?theme=group" className="hover:text-white">Group Tours</Link></li>
            <li><Link href="/admin" className="hover:text-white">Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Get in touch</h4>
          <ul className="space-y-3 text-sm">
            {phone && (
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-brand-400" /> <a href={`tel:${phone}`} className="hover:text-white">{phone}</a>
              </li>
            )}
            {email && (
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-brand-400" /> <a href={`mailto:${email}`} className="hover:text-white">{email}</a>
              </li>
            )}
            {address && (
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-brand-400" /> <span>{address}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <p>Designed & built with Next.js + Payload CMS.</p>
        </div>
      </div>
    </footer>
  )
}
