import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Custom hook for GSAP scroll animations
export const useGSAPScrollAnimations = () => {
  useEffect(() => {
    // Refresh ScrollTrigger on component mount
    ScrollTrigger.refresh()
    
    return () => {
      // Clean up all ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])
}

// Fade in from bottom animation
export const useFadeInUp = (ref, options = {}) => {
  const { delay = 0, duration = 1, y = 50, stagger = 0 } = options
  
  useEffect(() => {
    if (!ref.current) return
    
    const elements = ref.current.children ? Array.from(ref.current.children) : [ref.current]
    
    gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: y,
      },
      {
        opacity: 1,
        y: 0,
        duration: duration,
        delay: delay,
        stagger: stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    )
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [ref, delay, duration, y, stagger])
}

// Scale in animation
export const useScaleIn = (ref, options = {}) => {
  const { delay = 0, duration = 0.8, scale = 0.8 } = options
  
  useEffect(() => {
    if (!ref.current) return
    
    gsap.fromTo(
      ref.current,
      {
        opacity: 0,
        scale: scale,
      },
      {
        opacity: 1,
        scale: 1,
        duration: duration,
        delay: delay,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [ref, delay, duration, scale])
}

// Staggered text reveal animation
export const useTextReveal = (ref, options = {}) => {
  const { delay = 0, stagger = 0.05 } = options
  
  useEffect(() => {
    if (!ref.current) return
    
    const text = ref.current.textContent
    ref.current.innerHTML = ''
    
    // Split text into spans for each character
    text.split('').forEach(char => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00A0' : char
      span.style.display = 'inline-block'
      span.style.opacity = '0'
      ref.current.appendChild(span)
    })
    
    gsap.to(ref.current.children, {
      opacity: 1,
      y: 0,
      stagger: stagger,
      delay: delay,
      duration: 0.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    })
  }, [ref, delay, stagger])
}

// Parallax scroll effect
export const useParallax = (ref, options = {}) => {
  const { speed = 0.5 } = options
  
  useEffect(() => {
    if (!ref.current) return
    
    gsap.to(ref.current, {
      y: `${speed * 100}%`,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }, [ref, speed])
}

// Magnetic button effect (for mouse tracking)
export const useMagneticEffect = (ref, options = {}) => {
  const { strength = 0.3 } = options
  
  useEffect(() => {
    if (!ref.current) return
    
    const element = ref.current
    
    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength
      
      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
    
    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      })
    }
    
    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ref, strength])
}

// Horizontal scroll animation
export const useHorizontalScroll = (containerRef, contentRef) => {
  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return
    
    const content = contentRef.current
    const container = containerRef.current
    
    const scrollWidth = content.scrollWidth - container.offsetWidth
    
    gsap.to(content, {
      x: -scrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${scrollWidth}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    })
  }, [containerRef, contentRef])
}

// Counter animation
export const useCountUp = (ref, options = {}) => {
  const { end = 100, duration = 2, prefix = '', suffix = '' } = options
  
  useEffect(() => {
    if (!ref.current) return
    
    const obj = { value: 0 }
    
    gsap.to(obj, {
      value: end,
      duration: duration,
      ease: 'power2.out',
      onUpdate: () => {
        ref.current.textContent = `${prefix}${Math.round(obj.value)}${suffix}`
      },
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    })
  }, [ref, end, duration, prefix, suffix])
}

// Smooth reveal with clip-path
export const useClipReveal = (ref, options = {}) => {
  const { delay = 0, duration = 1 } = options
  
  useEffect(() => {
    if (!ref.current) return
    
    gsap.fromTo(
      ref.current,
      {
        clipPath: 'inset(100% 0% 0% 0%)',
      },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: duration,
        delay: delay,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [ref, delay, duration])
}

export default {
  useGSAPScrollAnimations,
  useFadeInUp,
  useScaleIn,
  useTextReveal,
  useParallax,
  useMagneticEffect,
  useHorizontalScroll,
  useCountUp,
  useClipReveal,
}
