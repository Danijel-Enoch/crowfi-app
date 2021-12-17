import { FooterLinkType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

export const footerLinks: (t: ContextApi['t']) => FooterLinkType[] = () => [
  // {
  //   label: t('About'),
  //   items: [
  //     {
  //       label: t('Contact'),
  //       href: 'https://docs.crowfi.app/contact-us',
  //     },
  //     {
  //       label: t('Brand'),
  //       href: 'https://docs.crowfi.app/brand',
  //     },
  //     {
  //       label: t('Blog'),
  //       href: 'https://medium.com/pancakeswap',
  //     },
  //     {
  //       label: t('Community'),
  //       href: 'https://docs.crowfi.app/contact-us/telegram',
  //     },
  //     {
  //       label: t('CAKE token'),
  //       href: 'https://docs.crowfi.app/tokenomics/cake',
  //     },
  //     {
  //       label: '—',
  //     },
  //     {
  //       label: t('Online Store'),
  //       href: 'https://pancakeswap.creator-spring.com/',
  //       isHighlighted: true,
  //     },
  //   ],
  // },
  // {
  //   label: t('Help'),
  //   items: [
  //     {
  //       label: t('Customer Support'),
  //       href: 'https://docs.crowfi.app/contact-us/customer-support',
  //     },
  //     {
  //       label: t('Troubleshooting'),
  //       href: 'https://docs.crowfi.app/help/troubleshooting',
  //     },
  //     {
  //       label: t('Guides'),
  //       href: 'https://docs.crowfi.app/get-started',
  //     },
  //   ],
  // },
  // {
  //   label: t('Developers'),
  //   items: [
  //     {
  //       label: 'Github',
  //       href: 'https://github.com/pancakeswap',
  //     },
  //     {
  //       label: t('Documentation'),
  //       href: 'https://docs.crowfi.app',
  //     },
  //     {
  //       label: t('Bug Bounty'),
  //       href: 'https://app.gitbook.com/@pancakeswap-1/s/pancakeswap/code/bug-bounty',
  //     },
  //     {
  //       label: t('Audits'),
  //       href: 'https://docs.crowfi.app/help/faq#audits,
  //     },
  //     {
  //       label: t('Careers'),
  //       href: 'https://docs.crowfi.app/hiring/become-a-chef',
  //     },
  //   ],
  // },
]
