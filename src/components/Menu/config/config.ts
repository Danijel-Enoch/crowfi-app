import { DropdownMenuItemType, MenuItemsType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import noop from "lodash"

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  {
    label: t('Trade'),
    icon: 'Trade',
    href: '/swap',
    showItemsOnMobile: false,
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
    label: t('Earn'),
    href: '/farms',
    icon: 'Earn',
    items: [
      {
        label: t('Nests'),
        href: '/farms',
      },
      {
        label: t('Pools'),
        href: '/pools',
      },
      {
        label: t('Referrals'),
        href: '/referrals',
      },
    ],
  },
  {
    label: t('Utilities'),
    href: '/presale',
    icon: 'Launchpad',
    items: [
      {
        label: t('Launchpad'),
        href: '/presale',
      },
      {
        label: t('Token Factory'),
        href: '/token-factory',
      },
      {
        label: t('Lockers'),
        href: '/lockers',
      },
      {
        label: t('Airdropper'),
        href: '/airdropper',
      },
      {
        label: t('New Pairs'),
        href: '/ape',
      },
    ]
  },
  {
    label: '',
    href: undefined,
    icon: 'More',
    onClick: noop,
    hideSubNav: true,
    showItemsOnMobile: true,
    items: [
      {
        label: t('Claim'),
        href: '/privatesales',
      },
      {
        type: DropdownMenuItemType.DIVIDER,
      },
      {
        type: 1,
        label: t('EvoDeFi Bridge'),
        href: 'https://bridge.evodefi.com',
      },
      {
        type: 1,
        label: t('Cronos Bridge'),
        href: 'https://cronos.crypto.org/docs/bridge/cdcex.html',
      },
      {
        type: 1,
        label: t('XY Finance'),
        href: 'https://app.xy.finance',
      },
      {
        type: DropdownMenuItemType.DIVIDER,
      },
      {
        type: 1,
        label: t('Documentation'),
        href: 'https://docs.crowfi.app',
      },
    ],
  }
  

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
