import Swiper from 'swiper/swiper-bundle.js'
import 'swiper/swiper-bundle.css'
import IMask from 'imask'

import ScrollMagic from 'scrollmagic'
import { gsap, TweenMax } from 'gsap'
import { ScrollToPlugin } from 'gsap/all'
gsap.registerPlugin(ScrollToPlugin)

class Init {
  constructor() {
    this.init()

    // Init smothscroll
    this.controller = new ScrollMagic.Controller()
    this.controller.scrollTo(function (newpos) {
      TweenMax.to(window, 0.6, { scrollTo: { y: newpos } })
    })

    this.directionScroll = []
  }

  init() {
    this.actions().initVhVar()

    this.events()

    this.actions().initPhoneMask()

    setTimeout(() => {
      this.actions().showBody()
      this.actions().scrollToBlockOnLoading()
    }, 300)

    if (document.querySelectorAll('.case-content__slider').length) {
      const caseSliders = document.querySelectorAll('.case-content__slider')
      caseSliders.forEach((item) => {
        this.actions().initCaseSlider(item)
      })
    }
  }

  events() {
    const _this = this

    document.addEventListener('scroll', (e) => {
      _this.actions().toggleHeaderOnScroll()
    })

    window.addEventListener('resize', () => {
      _this.actions().initVhVar()
    })

    window.ap(document).on('click', 'a.header-list__link', function (e) {
      e.preventDefault()
      _this.actions().scrollToBlock(this)
      if (document.documentElement.clientWidth < 1024) {
        _this.actions().toggleMenu(this)
      }
    })

    window.ap(document).on('click', 'a.mobile-menu__link', function (e) {
      e.preventDefault()
      _this.actions().scrollToBlock(this)
    })

    window.ap(document).on('click', 'a.footer-list__link', function (e) {
      e.preventDefault()
      _this.actions().scrollToBlock(this)
    })

    const emailInput = document.querySelectorAll('input[data-type="email"]')
    emailInput.forEach((item) => {
      item.addEventListener('blur', function () {
        _this.actions().checkEmail(this)
      })
    })

    const noTelAndEmailInput = document.querySelectorAll(
      'input:not([data-type="tel"]):not([data-type="email"]), textarea'
    )
    noTelAndEmailInput.forEach((item) => {
      item.addEventListener('blur', function () {
        _this.actions().checkOtherInputs(this)
      })
    })

    window.ap(document).on('click', '.popup-btn', function (e) {
      e.preventDefault()
      _this.actions().showPopup(this)
    })

    window.ap(document).on('click', '.overlay, .popup__close', function (e) {
      e.preventDefault()
      _this.actions().hidePopup(this)
    })

    const inputs = document.querySelectorAll('input')
    if (inputs.length) {
      inputs.forEach((item) => {
        item.addEventListener('focus', function () {
          this.select()
        })
      })
    }

    window.ap(document).on('click', '[data-servicelink]', function (e) {
      e.preventDefault()
      _this.actions().scrollToService(this)
    })

    window.ap(document).on('click', '.callback-form-files-main__more', function (e) {
      e.preventDefault()
      _this.actions().toggleFiles(this)
    })
    document.addEventListener('click', (e) => {
      const filesBtn = document.querySelector('.callback-form-files-main__more')
      const filesContainer = document.querySelector('.callback-form-files__list')
      if (
        e.target !== filesContainer &&
        e.target.closest('.callback-form-files__list') === null &&
        e.target !== filesBtn &&
        e.target.closest('.callback-form-files-main__more') === null
      ) {
        filesContainer.classList.remove('callback-form-files__list--active')
      }
    })

    window.ap(document).on('change', '.callback-form__list input', function (e) {
      e.preventDefault()
      _this.actions().changeCheck(this)
    })

    window.ap(document).on('click', '.header__burger', (e) => {
      e.preventDefault()
      _this.actions().toggleMenu()
    })
    window.ap(document).on('click', '.header__close', (e) => {
      e.preventDefault()
      _this.actions().toggleMenu()
    })
    document.addEventListener('click', (e) => {
      const burgerBtn = document.querySelector('.header__burger')
      const burgerContainer = document.querySelector('.header__wrap')
      const overlay = document.querySelector('.overlay')
      if (
        e.target !== burgerContainer &&
        e.target.closest('.header__wrap') === null &&
        e.target !== burgerBtn &&
        e.target.closest('.header__burger') === null
      ) {
        burgerBtn.classList.remove('mobile-menu__link--active')
        burgerContainer.classList.remove('header__wrap--active')
        overlay.classList.remove('overlay--menu')
        document.querySelector('html').classList.remove('fixed')
      }
    })
  }

  actions() {
    const _this = this

    return {
      initVhVar() {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
      },
      scrollToBlockOnLoading() {
        if (localStorage.getItem('idBLock')) {
          const element = document.querySelector(`#${localStorage.getItem('idBLock')}`)
          const topPos = element.getBoundingClientRect().top + window.pageYOffset - 100
          window.scrollTo({
            top: topPos
          })
          localStorage.removeItem('idBLock')
        }
      },
      scrollToBlock(el) {
        const id = el.getAttribute('href').split('#')[1] || ''
        const linkPathname = el.getAttribute('href').split('#')[0]
        const currentPathname = location.pathname
        if (id.length > 0 && currentPathname === linkPathname) {
          let blockScrollTop = document.querySelector(`#${id}`).getBoundingClientRect().top + pageYOffset - 100
          if (document.documentElement.clientWidth < 1024) {
            blockScrollTop = blockScrollTop + 100
          }
          _this.controller.scrollTo(blockScrollTop)
        } else if (id.length === 0 && currentPathname === linkPathname) {
          location.href = linkPathname
        }
        if (currentPathname !== linkPathname) {
          localStorage.setItem('idBLock', id)
          location.href = linkPathname
        }
      },
      toggleHeaderOnScroll() {
        _this.directionScroll.push(window.pageYOffset)
        if (_this.directionScroll[0] < _this.directionScroll[1] && window.pageYOffset > 200) {
          document.querySelector('.header').classList.add('header--hidden')
          _this.directionScroll = []
        } else if (_this.directionScroll[0] >= _this.directionScroll[1]) {
          document.querySelector('.header').classList.remove('header--hidden')
          _this.directionScroll = []
        }
      },
      initPhoneMask() {
        document.querySelectorAll('[data-type="tel"]').forEach((item) => {
          const telMask = IMask(item, {
            mask: '+{7} 000 000 00 00'
          })
          let flagInput = true
          item.addEventListener('input', (e) => {
            if ((e.target.value === '+7 8' || e.target.value === '+7') && flagInput === true) {
              e.target.value = '+7'
              telMask.masked.reset()
              telMask.value = '+7'
              flagInput = false
            } else if (e.target.value === '') {
              flagInput = true
            }
          })
          telMask.on('accept', function () {
            item.classList.remove('input-border')
          })
          telMask.on('complete', function () {
            item.classList.add('input-border')
          })
        })
      },
      checkEmail(el) {
        const pattern = /^[a-z0-9_.-]+@[a-z0-9_.-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i
        if (el.value !== '') {
          if (el.value.search(pattern) === 0) {
            el.classList.add('input-border')
          } else {
            el.classList.remove('input-border')
          }
        } else {
          el.classList.remove('input-err')
          el.classList.remove('input-border')
        }
      },
      checkOtherInputs(el) {
        if (el.value !== '') {
          el.classList.add('input-border')
        } else {
          el.classList.remove('input-border')
        }
      },
      showBody() {
        document.querySelector('body').style.opacity = 1
      },
      getScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth
      },
      showPopup(el) {
        const overlay = document.querySelector('.overlay')
        const popupSelector = el.getAttribute('data-popup')
        const popup = document.querySelector(`.popup[data-popup="${popupSelector}"]`)
        const popupClose = popup.querySelector('.popup__close')

        el.classList.add('popup-trigger')
        popup.classList.add('popup--active')
        overlay.classList.add('overlay--active')
        if (this.getScrollbarWidth()) {
          document.querySelector('html').classList.add('compensate-for-scrollbar')
        }
        document.querySelector('html').classList.add('fixed')
        if (document.documentElement.clientWidth > 1024) {
          popupClose.focus()
        }
      },
      hidePopup(el) {
        if (el.classList.contains('overlay--menu')) {
          el.classList.remove('overlay--menu')
        } else {
          const overlay = document.querySelector('.overlay')
          const popup = document.querySelector('.popup--active')
          const popupTrigger = document.querySelector('.popup-trigger')
          popup.classList.remove('popup--active')
          overlay.classList.remove('overlay--active')
          popupTrigger.focus()
          popupTrigger.classList.remove('popup-trigger')
          document.querySelector('html').classList.remove('compensate-for-scrollbar')
          document.querySelector('html').classList.remove('fixed')
        }
      },
      scrollToService(el) {
        const serviceData = el.dataset.servicelink
        const serviceBlock = document.querySelector(`[data-service="${serviceData}"]`)
        const serviceContainer = serviceBlock.closest('.services')
        const services = document.querySelectorAll('[data-service]')
        if (document.documentElement.clientWidth >= 1024) {
          _this.controller.scrollTo(serviceContainer.getBoundingClientRect().top + pageYOffset - 100)
        } else {
          _this.controller.scrollTo(serviceBlock.getBoundingClientRect().top + pageYOffset)
        }
        services.forEach((item) => {
          item.classList.remove('services__item--active')
        })
        serviceBlock.classList.add('services__item--active')
      },
      toggleFiles(el) {
        el.closest('.callback-form-files')
          .querySelector('.callback-form-files__list')
          .classList.toggle('callback-form-files__list--active')
      },
      changeCheck(el) {
        const checkboxComplex = el.closest('.callback-form__list').querySelector('[data-check="Комплексное решение"]')
        const checkboxes = el
          .closest('.callback-form__list')
          .querySelectorAll('input:not([data-check="Комплексное решение"])')
        if (el.dataset.check === 'Комплексное решение') {
          checkboxes.forEach((item) => {
            item.checked = false
          })
        } else {
          checkboxComplex.checked = false
        }
      },
      initCaseSlider(el) {
        const prevArr = el.querySelector('.swiper-button-prev')
        const nextArr = el.querySelector('.swiper-button-next')
        const pagination = el.querySelector('.swiper-pagination')
        const scrollbar = el.querySelector('.swiper-scrollbar')
        ;(() =>
          new Swiper(el, {
            spaceBetween: 15,
            slidesPerView: 1,
            navigation: {
              prevEl: prevArr,
              nextEl: nextArr
            },
            pagination: {
              el: pagination,
              type: 'fraction',
              formatFractionCurrent: function (current) {
                return ('0' + current).slice(-2)
              },
              formatFractionTotal: function (total) {
                return ('0' + total).slice(-2)
              }
            },
            scrollbar: {
              el: scrollbar
            }
          }))()
      },
      toggleMenu() {
        const burger = document.querySelector('.header__burger')
        const menu = document.querySelector('.header__wrap')
        const overlay = document.querySelector('.overlay')

        burger.classList.toggle('mobile-menu__link--active')
        overlay.classList.toggle('overlay--menu')
        menu.classList.toggle('header__wrap--active')
        document.querySelector('html').classList.toggle('fixed')
      }
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.controller = new Init()
})
