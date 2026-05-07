interface MonetizationDisclosureProps {
  className?: string
  includeNoAdsNote?: boolean
}

export default function MonetizationDisclosure({
  className,
  includeNoAdsNote = true,
}: MonetizationDisclosureProps) {
  return (
    <p className={className ?? 'text-xs text-gray-600 text-center'}>
      Affiliate disclosure: Some outbound retailer links may include affiliate tracking identifiers.
      {includeNoAdsNote ? ' No popup or interstitial ads are used.' : ''}
    </p>
  )
}