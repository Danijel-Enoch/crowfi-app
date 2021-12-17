import { MenuItemsType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  {
    label: t('Trade'),
    icon: 'Trade',
    href: '/swap',
    showItemsOnMobile: true,
    items: [
      {
        label: t('Token Exchange'),
        href: '/swap',
      },
      {
        label: t('Liquidity Pairs'),
        href: '/liquidity',
      },
    ],
  },
  {
    label: t('Nests'),
    href: '/farms',
    icon: 'Earn',
    items: [
      // {
      //   label: t('Nests'),
      //   href: '/farms',
      // },
      // {
      //   label: t('Pools'),
      //   href: '/pools',
      // },
    ],
  },
  {
    label: t('Referrals'),
    href: '/referrals',
    icon: 'Earn',
    items: []
  },
  {
    label: t('Private Sales'),
    href: '/privatesales',
    icon: 'Earn',
    items: []
  },

  // {
  //   label: t('Win'),
  //   href: '/prediction',
  //   icon: 'Trophy',
  //   items: [
  //     {
  //       label: t('Prediction (BETA)'),
  //       href: '/prediction',
  //     },
  //     {
  //       label: t('Lottery'),
  //       href: '/lottery',
  //     },
  //   ],
  // },
  // {
  //   label: t('NFT'),
  //   href: `${nftsBaseUrl}`,
  //   icon: 'Nft',
  //   items: [
  //     {
  //       label: t('Overview'),
  //       href: `${nftsBaseUrl}`,
  //     },
  //     {
  //       label: t('Collections'),
  //       href: `${nftsBaseUrl}/collections`,
  //     },
  //   ],
  // },
  // {
  //   label: '',
  //   href: '/info',
  //   icon: 'More',
  //   hideSubNav: true,
  //   items: [
  //     {
  //       label: t('Info'),
  //       href: '/info',
  //     },
  //     {
  //       label: t('IFO'),
  //       href: '/ifo',
  //     },
  //     {
  //       label: t('Voting'),
  //       href: '/voting',
  //     },
  //     {
  //       type: DropdownMenuItemType.DIVIDER,
  //     },
  //     {
  //       label: t('Leaderboard'),
  //       href: '/teams',
  //     },
  //     {
  //       type: DropdownMenuItemType.DIVIDER,
  //     },
  //     {
  //       label: t('Blog'),
  //       href: 'https://medium.com/pancakeswap',
  //       type: DropdownMenuItemType.EXTERNAL_LINK,
  //     },
  //     {
  //       label: t('Docs'),
  //       href: 'https://docs.crowfi.app',
  //       type: DropdownMenuItemType.EXTERNAL_LINK,
  //     },
  //   ],
  // },
]

export default config
