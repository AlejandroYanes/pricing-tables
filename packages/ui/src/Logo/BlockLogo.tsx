/* eslint-disable max-len */
'use client'

interface Props extends React.SVGProps<any> {
  white?: boolean;
}

export function BlockLogo(props: Props) {
  const { white, ...rest } = props;

  return (
    <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        className={white ? 'fill-white' : 'fill-emerald-500'}
        d="M23.4876 18.9743C23.4564 19.0678 23.3941 19.1925 23.3006 19.3483C23.2382 19.5042 23.1603 19.6757 23.0667 19.8628C22.9732 20.0186 22.8797 20.1589 22.7862 20.2836C22.6926 20.3771 22.6303 20.4083 22.5991 20.3771C22.5991 20.3771 22.6147 20.2992 22.6459 20.1433C22.677 19.9874 22.7082 19.816 22.7394 19.6289C22.8018 19.4419 22.8485 19.2704 22.8797 19.1145C22.942 18.9275 22.9732 18.8028 22.9732 18.7404C23.4408 16.2464 23.4408 14.0953 22.9732 12.2871C22.5056 10.479 21.7106 8.99814 20.5883 7.84465C19.4971 6.69116 18.141 5.83384 16.5199 5.27269C14.93 4.71153 13.2465 4.41537 11.4695 4.38419C10.1913 4.38419 8.92871 4.4933 7.68169 4.71153C6.46586 4.89858 5.34355 5.14798 4.31477 5.45974C3.31716 5.77149 2.45984 6.11442 1.74281 6.48852C1.05695 6.86263 0.620491 7.22114 0.433439 7.56407C0.215212 7.93817 0.152866 7.89141 0.246392 7.42378C0.495795 6.61322 1.15047 5.86501 2.21044 5.17915C3.30157 4.4933 4.56417 3.93215 5.99823 3.49569C7.4323 3.05924 8.92871 2.77865 10.4875 2.65395C12.0774 2.49807 13.5115 2.57602 14.7897 2.88777C15.6314 3.07483 16.4732 3.33981 17.3149 3.68274C18.1566 4.02567 18.9516 4.44655 19.6998 4.94535C20.4792 5.41298 21.1806 5.98971 21.8042 6.67557C22.4588 7.33025 23.0044 8.09404 23.4408 8.96695C24.2826 10.6504 24.6878 12.3963 24.6567 14.2044C24.6567 15.9814 24.267 17.5714 23.4876 18.9743ZM26.5272 18.6469C25.9348 20.3927 25.1399 21.9671 24.1423 23.37C23.1758 24.7729 22.1315 26.0354 21.0092 27.1578C19.8869 28.2489 18.7333 29.1998 17.5487 30.0103C16.364 30.8209 15.2573 31.5067 14.2285 32.0679C13.9168 32.2238 13.6518 32.3485 13.4336 32.442C13.2153 32.5355 13.1062 32.5511 13.1062 32.4887C13.0439 32.4576 13.1218 32.364 13.34 32.2082C13.5894 32.0211 13.8388 31.8341 14.0882 31.647C15.8341 30.2441 17.5175 28.7633 19.1387 27.2045C20.7909 25.6458 22.2718 23.8688 23.5811 21.8736C24.2358 20.8448 24.7346 19.7224 25.0776 18.5066C25.4205 17.2596 25.5919 15.9814 25.5919 14.6721C25.5919 13.3627 25.4049 12.0689 25.0308 10.7907C24.6878 9.51253 24.1423 8.32787 23.3941 7.23673C22.3965 5.80267 21.1806 4.66476 19.7466 3.82303C18.3437 2.9813 16.8316 2.40454 15.2105 2.09279C13.5894 1.74986 11.9215 1.64075 10.2069 1.76545C8.49225 1.89015 6.83997 2.18632 5.25002 2.65395C5.00062 2.7163 4.84475 2.76307 4.7824 2.79424C4.75122 2.82542 4.72004 2.80984 4.68886 2.74748C4.65769 2.68513 4.70445 2.62279 4.82915 2.56044C4.95385 2.49809 5.06296 2.43572 5.15649 2.37337C5.84235 1.99927 6.73085 1.65634 7.82198 1.34458C8.91312 1.03283 10.1446 0.845792 11.5163 0.783441C12.888 0.721091 14.3532 0.845782 15.912 1.15753C17.4708 1.43811 19.0451 1.99926 20.6351 2.841C22.3497 3.77626 23.6747 4.96092 24.6099 6.39499C25.5764 7.82906 26.2466 9.30989 26.6207 10.8375C26.9948 12.3339 27.1507 13.7991 27.0883 15.2332C27.026 16.6361 26.8389 17.774 26.5272 18.6469ZM6.18528 34.6869C6.0294 34.4375 5.82676 34.0478 5.57736 33.5178C5.35913 32.9566 5.18768 32.302 5.06298 31.5538C5.00063 31.1797 4.95386 30.7588 4.92269 30.2912C4.92269 29.8235 4.93827 29.3871 4.96944 28.9818C5.00062 28.5453 5.04738 28.1868 5.10973 27.9063C5.17208 27.6257 5.26561 27.4854 5.39031 27.4854C5.42149 27.4854 5.45267 27.5789 5.48385 27.766C5.5462 27.9218 5.59296 28.1089 5.62414 28.3271C5.68649 28.5453 5.71765 28.7636 5.71765 28.9818C5.74883 29.1689 5.76443 29.3091 5.76443 29.4027C5.82678 30.2132 5.92029 31.0238 6.04499 31.8343C6.20086 32.6449 6.4191 33.4243 6.69968 34.1725C7.79082 32.832 9.03783 31.4758 10.4407 30.1041C11.8436 28.7324 13.2153 27.3451 14.5559 25.9422C15.8964 24.5081 17.1122 23.0429 18.2034 21.5465C19.3257 20.0501 20.1363 18.5069 20.6351 16.9169C20.978 15.8258 21.0403 14.6879 20.8221 13.5032C20.635 12.3186 20.2454 11.243 19.653 10.2766C19.0607 9.34132 18.219 8.56195 17.1278 7.93845C16.0367 7.31494 14.8365 6.87848 13.5271 6.62908C12.9971 6.53555 12.4671 6.4576 11.9371 6.39525C11.4383 6.3329 10.9083 6.30174 10.3472 6.30174C10.4407 6.76937 10.4875 7.28376 10.4875 7.84491C10.5187 8.37489 10.5187 8.90488 10.4875 9.43486C10.4563 9.96484 10.4095 10.4792 10.3472 10.978C10.2848 11.4457 10.2069 11.8665 10.1134 12.2406C9.67693 13.9241 9.16252 15.6232 8.57019 17.3378C7.97786 19.0213 7.35436 20.6424 6.69968 22.2012C6.63733 22.2947 6.5438 22.4506 6.4191 22.6688C6.32558 22.8558 6.24763 22.9494 6.18528 22.9494C6.12293 22.9494 6.09176 22.8247 6.09176 22.5753C6.09176 22.3259 6.10735 22.1544 6.13852 22.0609C6.1697 21.6868 6.23204 21.2347 6.32557 20.7047C6.41909 20.1436 6.51262 19.5824 6.60615 19.0213C6.73085 18.4601 6.85556 17.9145 6.98026 17.3846C7.10496 16.8234 7.22966 16.3558 7.35436 15.9817C7.41671 15.7946 7.52582 15.3426 7.68169 14.6256C7.86875 13.9085 8.0558 13.0824 8.24285 12.1471C8.42991 11.2119 8.60138 10.2298 8.75726 9.20104C8.94431 8.14108 9.069 7.17465 9.13135 6.30174H8.57019C8.50784 7.51758 8.33639 8.76459 8.05581 10.0428C7.77523 11.321 7.4323 12.6147 7.02702 13.9241C6.65292 15.2023 6.24764 16.4961 5.81118 17.8054C5.4059 19.1148 5.04739 20.4242 4.73564 21.7335C4.67329 22.0141 4.57976 22.4973 4.45506 23.1832C4.36153 23.869 4.28359 24.6484 4.22123 25.5213C4.15888 26.3631 4.12772 27.2672 4.12772 28.2336C4.12772 29.1689 4.19007 30.0729 4.31477 30.9458C4.47065 31.7876 4.68886 32.5514 4.96944 33.2372C5.25002 33.9231 5.6553 34.4063 6.18528 34.6869ZM21.7104 18.2732C21.0245 19.8943 20.0736 21.4531 18.8578 22.9495C17.6731 24.4459 16.3794 25.8956 14.9765 27.2985C13.5736 28.6702 12.1239 29.9795 10.6275 31.2265C9.16226 32.4736 7.82172 33.6582 6.60588 34.7805C6.35648 34.9988 6.02913 35.0299 5.62385 34.8741C5.24975 34.687 4.96918 34.4688 4.78213 34.2194C4.12745 33.3465 3.64423 32.3645 3.33247 31.2733C3.02072 30.1822 2.83366 29.0599 2.77131 27.9064C2.70896 26.7217 2.74014 25.537 2.86485 24.3524C3.02072 23.1365 3.23894 21.9675 3.51952 20.8452C4.14303 18.2576 4.84447 15.7636 5.62385 13.3631C6.43441 10.9314 7.02674 8.62434 7.40085 6.44189C5.71738 6.62894 4.20538 7.01864 2.86485 7.61097C1.55548 8.17212 0.682562 8.85799 0.246108 9.66854C0.246108 9.73089 0.230526 9.76206 0.199351 9.76206C0.137 9.76206 0.137 9.63737 0.199351 9.38796C0.448754 8.51505 1.05667 7.76685 2.0231 7.14334C2.98954 6.48866 4.14304 5.98985 5.48358 5.64692C6.82412 5.27282 8.25817 5.05458 9.78576 4.99223C11.3445 4.92988 12.8565 5.02341 14.3218 5.27281C15.9117 5.55339 17.2835 6.1613 18.4369 7.09656C19.6216 8.00065 20.5413 9.0762 21.1959 10.3232C21.8818 11.5391 22.2715 12.8484 22.365 14.2513C22.4897 15.6542 22.2715 16.995 21.7104 18.2732ZM11.6563 7.65825C12.0304 8.46881 12.1707 9.52879 12.0772 10.8382C12.0148 12.1475 11.8433 13.5192 11.5628 14.9533C11.2822 16.3562 10.9549 17.7123 10.5807 19.0217C10.2378 20.331 9.97281 21.391 9.78576 22.2016C9.41166 23.698 8.95962 25.1944 8.42964 26.6908C7.89966 28.1872 7.46322 29.4966 7.12029 30.6189C6.96441 31.0553 6.85528 31.2736 6.79293 31.2736C6.69941 31.2736 6.65264 31.1956 6.65264 31.0398C6.65264 30.8527 6.65264 30.6813 6.65264 30.5254C6.74617 28.2184 7.07352 25.9427 7.63467 23.6981C8.227 21.4535 8.8661 19.1777 9.55196 16.8708C9.95724 15.4679 10.3469 14.0027 10.721 12.4751C11.0951 10.9475 11.3134 9.34201 11.3757 7.65854C11.3757 7.44031 11.4069 7.3156 11.4692 7.28442C11.5004 7.28442 11.5316 7.33119 11.5628 7.42471C11.5939 7.51824 11.6251 7.5959 11.6563 7.65825ZM17.2211 27.0649C17.2523 27.0961 17.1899 27.2208 17.034 27.439C16.8782 27.6572 16.6755 27.9066 16.4261 28.1872C16.2079 28.4366 15.9741 28.7016 15.7247 28.9822C15.5065 29.2316 15.3506 29.4031 15.257 29.4966C14.6024 30.1513 13.9321 30.8215 13.2462 31.5074C12.5916 32.1621 11.9057 32.7232 11.1887 33.1909L6.98 35.8564C6.91765 35.8875 6.82412 35.9187 6.69942 35.9499C6.60589 35.9811 6.52794 35.9811 6.46559 35.9499C6.40324 35.9187 6.37208 35.8719 6.37208 35.8096C6.40326 35.7472 6.43442 35.6849 6.46559 35.6225C6.49677 35.5602 6.54353 35.4978 6.60588 35.4355C7.13587 35.0614 7.7282 34.5937 8.38288 34.0326C9.06874 33.4714 9.77018 32.8947 10.4872 32.3024C11.0172 31.8971 11.6407 31.3827 12.3577 30.7592C13.106 30.1357 13.823 29.5433 14.5089 28.9822C15.2259 28.421 15.8338 27.9534 16.3326 27.5793C16.8626 27.174 17.1588 27.0026 17.2211 27.0649Z"
      />
    </svg>

  );
}
