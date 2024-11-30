import { memo } from 'react';

interface SVGProps {
  style?: React.CSSProperties;
}
export const MotionBrushSVG = memo<SVGProps>(({ style }) => {
  const strokeColor = style?.stroke || 'white';
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M18.37 2.8784L14 7.2484L12.41 5.6584C12.0353 5.2859 11.5284 5.07681 11 5.07681C10.4716 5.07681 9.96473 5.2859 9.59 5.6584L8 7.2484L17 16.2484L18.59 14.6584C18.9625 14.2837 19.1716 13.7768 19.1716 13.2484C19.1716 12.72 18.9625 12.2131 18.59 11.8384L17 10.2484L21.37 5.8784C21.7678 5.48058 21.9913 4.94101 21.9913 4.3784C21.9913 3.81579 21.7678 3.27623 21.37 2.8784C20.9722 2.48058 20.4326 2.25708 19.87 2.25708C19.3074 2.25708 18.7678 2.48058 18.37 2.8784Z"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 8.24841C7 11.2484 5 11.7484 2 12.2484L10 22.2484C12 21.2484 16 17.2484 16 15.2484"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 17.7484L4.5 15.2484"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});
export const RedoSVG = memo(() => {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.37541 10.65L3.60547 6.88005L7.37541 3.11011"
        stroke="#AEAEAE"
        strokeWidth="1.69647"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.6693 15.1738V9.89584C15.6693 9.09596 15.3515 8.32884 14.7859 7.76323C14.2203 7.19763 13.4532 6.87988 12.6533 6.87988H3.60547"
        stroke="#AEAEAE"
        strokeWidth="1.69647"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const UndoSVG = memo(() => {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.5669 10.65L15.3368 6.88005L11.5669 3.11011"
        stroke="#AEAEAE"
        strokeWidth="1.69647"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.27295 15.1738V9.89584C3.27295 9.09596 3.5907 8.32884 4.1563 7.76323C4.7219 7.19763 5.48902 6.87988 6.2889 6.87988H15.3368"
        stroke="#AEAEAE"
        strokeWidth="1.69647"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const BrushSVG = memo(() => {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.4043 9.30533L13.4904 3.22675C13.6888 3.02195 13.926 2.85868 14.1881 2.74643C14.4502 2.63418 14.732 2.57521 15.0171 2.57294C15.3023 2.57068 15.585 2.62517 15.8488 2.73324C16.1127 2.84131 16.3524 3.00079 16.5541 3.20241C16.7557 3.40403 16.9152 3.64375 17.0232 3.90761C17.1313 4.17147 17.1858 4.4542 17.1835 4.73932C17.1813 5.02445 17.1223 5.30627 17.01 5.56838C16.8978 5.83049 16.7345 6.06765 16.5297 6.26604L10.4511 12.3597"
        stroke="#C0C0C0"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.9037 11.598C4.65179 11.598 3.6412 12.6161 3.6412 13.8756C3.6412 14.8786 1.75579 15.0219 2.13287 15.399C2.94737 16.2286 4.01075 16.9224 5.14954 16.9224C6.8087 16.9224 8.1662 15.5649 8.1662 13.8756C8.1672 13.5775 8.10946 13.2821 7.9963 13.0063C7.88313 12.7305 7.71675 12.4797 7.50666 12.2682C7.29657 12.0567 7.04688 11.8887 6.77184 11.7737C6.4968 11.6587 6.20181 11.599 5.9037 11.598Z"
        stroke="#C0C0C0"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const BgImageSVG = memo(() => {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.9505 9.38076V14.6599C15.9505 15.06 15.7916 15.4436 15.5087 15.7265C15.2258 16.0093 14.8422 16.1683 14.4422 16.1683H3.88382C3.48379 16.1683 3.10014 16.0093 2.81727 15.7265C2.5344 15.4436 2.37549 15.06 2.37549 14.6599V4.1016C2.37549 3.70156 2.5344 3.31791 2.81727 3.03504C3.10014 2.75217 3.48379 2.59326 3.88382 2.59326H9.16299"
        stroke="#AEAEAE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.8423 2.50171L16.0419 5.70137"
        stroke="#AEAEAE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.0415 2.50171L12.8418 5.70137"
        stroke="#AEAEAE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.90042 8.62665C7.73345 8.62665 8.40876 7.95135 8.40876 7.11832C8.40876 6.28529 7.73345 5.60999 6.90042 5.60999C6.06739 5.60999 5.39209 6.28529 5.39209 7.11832C5.39209 7.95135 6.06739 8.62665 6.90042 8.62665Z"
        stroke="#AEAEAE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.9502 11.6434L13.6228 9.31601C13.34 9.03324 12.9564 8.87439 12.5564 8.87439C12.1565 8.87439 11.7729 9.03324 11.4901 9.31601L4.6377 16.1684"
        stroke="#AEAEAE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});
export const ForegroundImageSVG = memo(() => {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.35693 5.60993V4.1016C2.35693 3.70156 2.51585 3.31791 2.79871 3.03504C3.08158 2.75217 3.46523 2.59326 3.86527 2.59326H5.3736"
        stroke="#AEAEAE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.915 2.59326H14.4234C14.8234 2.59326 15.2071 2.75217 15.4899 3.03504C15.7728 3.31791 15.9317 3.70156 15.9317 4.1016V5.60993"
        stroke="#AEAEAE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.9317 13.1516V14.6599C15.9317 15.06 15.7728 15.4436 15.4899 15.7265C15.2071 16.0094 14.8234 16.1683 14.4234 16.1683H12.915"
        stroke="#AEAEAE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.3736 16.1683H3.86527C3.46523 16.1683 3.08158 16.0094 2.79871 15.7265C2.51585 15.4436 2.35693 15.06 2.35693 14.6599V13.1516"
        stroke="#AEAEAE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.14434 11.6433C10.3939 11.6433 11.4068 10.6303 11.4068 9.38079C11.4068 8.13124 10.3939 7.11829 9.14434 7.11829C7.89479 7.11829 6.88184 8.13124 6.88184 9.38079C6.88184 10.6303 7.89479 11.6433 9.14434 11.6433Z"
        stroke="#AEAEAE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.1609 12.3975L10.728 10.9646"
        stroke="#AEAEAE"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const EraserSVG = memo<SVGProps>(({ style }) => {
  const strokeColor = style?.stroke || 'white';
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <g clipPath="url(#clip0_260_4460)">
        <path
          d="M5.42629 16.166L2.18414 12.9239C1.43016 12.1699 1.43016 11.0389 2.18414 10.3603L9.42243 3.12201C10.1764 2.36802 11.3074 2.36802 11.986 3.12201L16.2083 7.34434C16.9623 8.09833 16.9623 9.22931 16.2083 9.9079L9.95022 16.166"
          stroke={strokeColor}
          strokeWidth="1.69647"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.7361 16.1661H5.42627"
          stroke={strokeColor}
          strokeWidth="1.69647"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.91846 8.6261L10.7044 15.412"
          stroke={strokeColor}
          strokeWidth="1.69647"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_260_4460">
          <rect
            width="18.0957"
            height="18.0957"
            fill="white"
            transform="translate(0.148438 0.332397)"
          />
        </clipPath>
      </defs>
    </svg>
  );
});

export const StarSVG = memo<SVGProps>(({ style }) => {
  const strokeColor = style?.stroke || 'white';
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.29308 2.55614C4.47286 1.81473 5.52731 1.81473 5.70709 2.55614L6.20176 4.59617C6.26595 4.86087 6.47263 5.06755 6.73733 5.13173L8.77736 5.62641C9.51877 5.80619 9.51877 6.86064 8.77736 7.04042L6.73733 7.5351C6.47263 7.59928 6.26595 7.80596 6.20176 8.07066L5.70709 10.1107C5.52731 10.8521 4.47286 10.8521 4.29308 10.1107L3.7984 8.07066C3.73421 7.80596 3.52754 7.59928 3.26283 7.5351L1.2228 7.04042C0.481397 6.86064 0.481396 5.80619 1.2228 5.62641L3.26283 5.13173C3.52754 5.06755 3.73421 4.86087 3.7984 4.59617L4.29308 2.55614Z"
        fill="black"
      />
      <path
        d="M10.2317 9.6756C10.3423 9.21935 10.9912 9.21935 11.1018 9.6756L11.4062 10.931C11.4457 11.0939 11.5729 11.2211 11.7358 11.2606L12.9912 11.565C13.4475 11.6756 13.4475 12.3245 12.9912 12.4352L11.7358 12.7396C11.5729 12.7791 11.4457 12.9063 11.4062 13.0692L11.1018 14.3246C10.9912 14.7808 10.3423 14.7808 10.2317 14.3246L9.92725 13.0692C9.88775 12.9063 9.76057 12.7791 9.59767 12.7396L8.34227 12.4352C7.88602 12.3245 7.88602 11.6756 8.34227 11.565L9.59767 11.2606C9.76057 11.2211 9.88775 11.0939 9.92725 10.931L10.2317 9.6756Z"
        fill="black"
      />
      <path
        d="M12.3812 2.47464C12.4538 2.17523 12.8797 2.17523 12.9523 2.47464L13.152 3.2985C13.178 3.4054 13.2614 3.48887 13.3683 3.51479L14.1922 3.71456C14.4916 3.78716 14.4916 4.213 14.1922 4.2856L13.3683 4.48538C13.2614 4.5113 13.178 4.59476 13.152 4.70166L12.9523 5.52552C12.8797 5.82493 12.4538 5.82494 12.3812 5.52552L12.1815 4.70166C12.1555 4.59476 12.0721 4.5113 11.9652 4.48538L11.1413 4.2856C10.8419 4.213 10.8419 3.78716 11.1413 3.71456L11.9652 3.51479C12.0721 3.48887 12.1555 3.4054 12.1815 3.2985L12.3812 2.47464Z"
        fill="black"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.6667 2.62081L12.5037 3.29322C12.4385 3.562 12.2287 3.77186 11.9599 3.83703L11.2875 4.00008L11.9599 4.16313C12.2287 4.22831 12.4385 4.43816 12.5037 4.70694L12.6667 5.37935L12.8298 4.70694C12.895 4.43816 13.1048 4.22831 13.3736 4.16313L14.046 4.00008L13.3736 3.83703C13.1048 3.77186 12.895 3.562 12.8298 3.29322L12.6667 2.62081ZM12.9931 2.25672C12.9101 1.91453 12.4234 1.91453 12.3404 2.25672L12.1121 3.19827C12.0825 3.32045 11.9871 3.41583 11.8649 3.44546L10.9234 3.67377C10.5812 3.75675 10.5812 4.24342 10.9234 4.32639L11.8649 4.5547C11.9871 4.58433 12.0825 4.67972 12.1121 4.80189L12.3404 5.74344C12.4234 6.08563 12.9101 6.08563 12.9931 5.74344L13.2214 4.80189C13.251 4.67972 13.3464 4.58433 13.4686 4.5547L14.4101 4.32639C14.7523 4.24342 14.7523 3.75675 14.4101 3.67377L13.4686 3.44546C13.3464 3.41583 13.251 3.32045 13.2214 3.19827L12.9931 2.25672Z"
        fill="black"
      />
      <path
        d="M4.66675 15.3334C4.29856 15.3334 4.00008 15.0349 4.00008 14.6667C4.00008 14.2986 4.29856 14.0001 4.66675 14.0001C5.03494 14.0001 5.33342 14.2986 5.33342 14.6667C5.33342 15.0349 5.03494 15.3334 4.66675 15.3334Z"
        fill="black"
      />
      <path
        d="M1.33341 12.6667C0.965225 12.6667 0.666748 12.3683 0.666748 12.0001C0.666748 11.6319 0.965225 11.3334 1.33341 11.3334C1.7016 11.3334 2.00008 11.6319 2.00008 12.0001C2.00008 12.3683 1.7016 12.6667 1.33341 12.6667Z"
        fill="black"
      />
      <path
        d="M8.66675 2.00008C8.29856 2.00008 8.00008 1.7016 8.00008 1.33341C8.00008 0.965225 8.29856 0.666748 8.66675 0.666748C9.03494 0.666748 9.33342 0.965225 9.33342 1.33341C9.33342 1.7016 9.03494 2.00008 8.66675 2.00008Z"
        fill="black"
      />
      <path
        d="M14.6667 9.33342C14.2986 9.33342 14.0001 9.03494 14.0001 8.66675C14.0001 8.29856 14.2986 8.00008 14.6667 8.00008C15.0349 8.00008 15.3334 8.29856 15.3334 8.66675C15.3334 9.03494 15.0349 9.33342 14.6667 9.33342Z"
        fill="black"
      />
    </svg>
  );
});
export const VideoSVG = memo<SVGProps>(({ style }) => {
  const strokeColor = style?.stroke || 'white';
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.3607 4.38099L2.48386 7.54286L1.91473 6.02516C1.72501 5.32955 2.10444 4.63394 2.73681 4.44423L11.2739 1.91473C11.9695 1.72501 12.6651 2.10444 12.8548 2.73681L13.3607 4.38099Z"
        stroke="#707070"
        strokeWidth="1.26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.50781 3.93835L6.46818 6.40462"
        stroke="#707070"
        strokeWidth="1.26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.42822 2.73682L10.3886 5.26632"
        stroke="#707070"
        strokeWidth="1.26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.48389 7.54297H13.8666V12.602C13.8666 12.9374 13.7334 13.2591 13.4962 13.4963C13.259 13.7335 12.9373 13.8667 12.6019 13.8667H3.74864C3.4132 13.8667 3.09151 13.7335 2.85432 13.4963C2.61714 13.2591 2.48389 12.9374 2.48389 12.602V7.54297Z"
        stroke="#707070"
        strokeWidth="1.26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});
export const PlaySVG = memo<SVGProps>(({ style }) => {
  const strokeColor = style?.stroke || 'white';
  return (
    <svg width="18" height="18" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.5967 2.83362H3.74757C3.04939 2.83362 2.4834 3.3996 2.4834 4.09778V12.947C2.4834 13.6451 3.04939 14.2111 3.74757 14.2111H12.5967C13.2949 14.2111 13.8609 13.6451 13.8609 12.947V4.09778C13.8609 3.3996 13.2949 2.83362 12.5967 2.83362Z"
        stroke="#707070"
        strokeWidth="1.26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.27588 5.99402L10.0684 8.52235L6.27588 11.0507V5.99402Z"
        stroke="#707070"
        strokeWidth="1.26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const MovieSVG = memo<SVGProps>(({ style }) => {
  const strokeColor = style?.stroke || 'white';
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.5967 2.17712H3.74757C3.04939 2.17712 2.4834 2.74311 2.4834 3.44129V12.2905C2.4834 12.9886 3.04939 13.5546 3.74757 13.5546H12.5967C13.2949 13.5546 13.8609 12.9886 13.8609 12.2905V3.44129C13.8609 2.74311 13.2949 2.17712 12.5967 2.17712Z"
        stroke="#707070"
        strokeWidth="1.26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.01172 2.17712V13.5546"
        stroke="#707070"
        strokeWidth="1.26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.4834 5.02148H5.01173"
        stroke="#707070"
        strokeWidth="1.26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.4834 7.86584H13.8609"
        stroke="#707070"
        strokeWidth="1.26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.4834 10.7102H5.01173"
        stroke="#707070"
        strokeWidth="1.26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.3325 2.17712V13.5546"
        stroke="#707070"
        strokeWidth="1.26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.3325 5.02148H13.8609"
        stroke="#707070"
        strokeWidth="1.26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.3325 10.7102H13.8609"
        stroke="#707070"
        strokeWidth="1.26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});
export const ZoomSVG = memo<SVGProps>(({ style }) => {
  const strokeColor = style?.stroke || 'white';
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.8609 13.8605L10.0684 10.068M13.8609 13.8605V10.8265M13.8609 13.8605H10.8269"
        stroke="#707070"
        strokeWidth="1.26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.4834 10.8265V13.8605M2.4834 13.8605H5.5174M2.4834 13.8605L6.2759 10.068"
        stroke="#707070"
        strokeWidth="1.26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.8609 5.51703V2.48303M13.8609 2.48303H10.8269M13.8609 2.48303L10.0684 6.27553"
        stroke="#707070"
        strokeWidth="1.26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.4834 5.51703V2.48303M2.4834 2.48303H5.5174M2.4834 2.48303L6.2759 6.27553"
        stroke="#707070"
        strokeWidth="1.26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});
