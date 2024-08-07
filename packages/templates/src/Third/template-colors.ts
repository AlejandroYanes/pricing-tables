/* eslint-disable max-len */
import { type Colors } from '@dealo/helpers';

export const PRODUCT_BUTTON_COLORS: Partial<Record<Colors, string>> = {
  'red': 'border-gray-200 dark:border-gray-800 data-[active=true]:border-red-500 dark:data-[active=true]:border-red-500 data-[active=true]:text-red-500 data-[selected=true]:bg-red-600 dark:data-[selected=true]:bg-red-600 data-[selected=true]:text-white dark:data-[selected=true]:text-white',
  'orange': 'border-gray-200 dark:border-gray-800 data-[active=true]:border-orange-500 dark:data-[active=true]:border-orange-500 data-[active=true]:text-orange-500 data-[selected=true]:bg-orange-600 dark:data-[selected=true]:bg-orange-600 data-[selected=true]:text-white dark:data-[selected=true]:text-white',
  'amber': 'border-gray-200 dark:border-gray-800 data-[active=true]:border-amber-500 dark:data-[active=true]:border-amber-500 data-[active=true]:text-amber-500 data-[selected=true]:bg-amber-600 dark:data-[selected=true]:bg-amber-600 data-[selected=true]:text-white dark:data-[selected=true]:text-white',
  'yellow': 'border-gray-200 dark:border-gray-800 data-[active=true]:border-yellow-500 dark:data-[active=true]:border-yellow-500 data-[active=true]:text-yellow-500 data-[selected=true]:bg-yellow-600 dark:data-[selected=true]:bg-yellow-600 data-[selected=true]:text-white dark:data-[selected=true]:text-white',
  'lime': 'border-gray-200 dark:border-gray-800 data-[active=true]:border-lime-500 dark:data-[active=true]:border-lime-500 data-[active=true]:text-lime-500 data-[selected=true]:bg-lime-600 dark:data-[selected=true]:bg-lime-600 data-[selected=true]:text-white dark:data-[selected=true]:text-white',
  'green': 'border-gray-200 dark:border-gray-800 data-[active=true]:border-green-500 dark:data-[active=true]:border-green-500 data-[active=true]:text-green-500 data-[selected=true]:bg-green-600 dark:data-[selected=true]:bg-green-600 data-[selected=true]:text-white dark:data-[selected=true]:text-white',
  'emerald': 'border-gray-200 dark:border-gray-800 data-[active=true]:border-emerald-500 dark:data-[active=true]:border-emerald-500 data-[active=true]:text-emerald-500 data-[selected=true]:bg-emerald-600 dark:data-[selected=true]:bg-emerald-600 data-[selected=true]:text-white dark:data-[selected=true]:text-white',
  'teal': 'border-gray-200 dark:border-gray-800 data-[active=true]:border-teal-500 dark:data-[active=true]:border-teal-500 data-[active=true]:text-teal-500 data-[selected=true]:bg-teal-600 dark:data-[selected=true]:bg-teal-600 data-[selected=true]:text-white dark:data-[selected=true]:text-white',
  'cyan': 'border-gray-200 dark:border-gray-800 data-[active=true]:border-cyan-500 dark:data-[active=true]:border-cyan-500 data-[active=true]:text-cyan-500 data-[selected=true]:bg-cyan-600 dark:data-[selected=true]:bg-cyan-600 data-[selected=true]:text-white dark:data-[selected=true]:text-white',
  'sky': 'border-gray-200 dark:border-gray-800 data-[active=true]:border-sky-500 dark:data-[active=true]:border-sky-500 data-[active=true]:text-sky-500 data-[selected=true]:bg-sky-600 dark:data-[selected=true]:bg-sky-600 data-[selected=true]:text-white dark:data-[selected=true]:text-white',
  'blue': 'border-gray-200 dark:border-gray-800 data-[active=true]:border-blue-500 dark:data-[active=true]:border-blue-500 data-[active=true]:text-blue-500 data-[selected=true]:bg-blue-600 dark:data-[selected=true]:bg-blue-600 data-[selected=true]:text-white dark:data-[selected=true]:text-white',
  'indigo': 'border-gray-200 dark:border-gray-800 data-[active=true]:border-indigo-500 dark:data-[active=true]:border-indigo-500 data-[active=true]:text-indigo-500 data-[selected=true]:bg-indigo-600 dark:data-[selected=true]:bg-indigo-600 data-[selected=true]:text-white dark:data-[selected=true]:text-white',
  'violet': 'border-gray-200 dark:border-gray-800 data-[active=true]:border-violet-500 dark:data-[active=true]:border-violet-500 data-[active=true]:text-violet-500 data-[selected=true]:bg-violet-600 dark:data-[selected=true]:bg-violet-600 data-[selected=true]:text-white dark:data-[selected=true]:text-white',
  'purple': 'border-gray-200 dark:border-gray-800 data-[active=true]:border-purple-500 dark:data-[active=true]:border-purple-500 data-[active=true]:text-purple-500 data-[selected=true]:bg-purple-600 dark:data-[selected=true]:bg-purple-600 data-[selected=true]:text-white dark:data-[selected=true]:text-white',
  'fuchsia': 'border-gray-200 dark:border-gray-800 data-[active=true]:border-fuchsia-500 dark:data-[active=true]:border-fuchsia-500 data-[active=true]:text-fuchsia-500 data-[selected=true]:bg-fuchsia-600 dark:data-[selected=true]:bg-fuchsia-600 data-[selected=true]:text-white dark:data-[selected=true]:text-white',
  'pink': 'border-gray-200 dark:border-gray-800 data-[active=true]:border-pink-500 dark:data-[active=true]:border-pink-500 data-[active=true]:text-pink-500 data-[selected=true]:bg-pink-600 dark:data-[selected=true]:bg-pink-600 data-[selected=true]:text-white dark:data-[selected=true]:text-white',
  'rose': 'border-gray-200 dark:border-gray-800 data-[active=true]:border-rose-500 dark:data-[active=true]:border-rose-500 data-[active=true]:text-rose-500 data-[selected=true]:bg-rose-600 dark:data-[selected=true]:bg-rose-600 data-[selected=true]:text-white dark:data-[selected=true]:text-white',
};

export const CHECK_ICON_COLORS: Partial<Record<Colors, string>> = {
  'red': 'fill-red-500 stroke-slate-50 dark:stroke-slate-800',
  'orange': 'fill-orange-500 stroke-slate-50 dark:stroke-slate-800',
  'amber': 'fill-amber-500 stroke-slate-50 dark:stroke-slate-800',
  'yellow': 'fill-yellow-500 stroke-slate-50 dark:stroke-slate-800',
  'lime': 'fill-lime-500 stroke-slate-50 dark:stroke-slate-800',
  'green': 'fill-green-500 stroke-slate-50 dark:stroke-slate-800',
  'emerald': 'fill-emerald-500 stroke-slate-50 dark:stroke-slate-800',
  'teal': 'fill-teal-500 stroke-slate-50 dark:stroke-slate-800',
  'cyan': 'fill-cyan-500 stroke-slate-50 dark:stroke-slate-800',
  'sky': 'fill-sky-500 stroke-slate-50 dark:stroke-slate-800',
  'blue': 'fill-blue-500 stroke-slate-50 dark:stroke-slate-800',
  'indigo': 'fill-indigo-500 stroke-slate-50 dark:stroke-slate-800',
  'violet': 'fill-violet-500 stroke-slate-50 dark:stroke-slate-800',
  'purple': 'fill-purple-500 stroke-slate-50 dark:stroke-slate-800',
  'fuchsia': 'fill-fuchsia-500 stroke-slate-50 dark:stroke-slate-800',
  'pink': 'fill-pink-500 stroke-slate-50 dark:stroke-slate-800',
  'rose': 'fill-rose-500 stroke-slate-50 dark:stroke-slate-800',
};

export const BUTTON_STYLES: Partial<Record<Colors, string>> = {
  'red': 'text-white bg-red-600 hover:bg-red-600/90 dark:bg-red-600 dark:hover:bg-red-600/90',
  'orange': 'text-white bg-orange-600 hover:bg-orange-600/90 dark:bg-orange-600 dark:hover:bg-orange-600/90',
  'amber': 'text-white bg-amber-600 hover:bg-amber-600/90 dark:bg-amber-600 dark:hover:bg-amber-600/90',
  'yellow': 'text-white bg-yellow-600 hover:bg-yellow-600/90 dark:bg-yellow-600 dark:hover:bg-yellow-600/90',
  'lime': 'text-white bg-lime-600 hover:bg-lime-600/90 dark:bg-lime-600 dark:hover:bg-lime-600/90',
  'green': 'text-white bg-green-600 hover:bg-green-600/90 dark:bg-green-600 dark:hover:bg-green-600/90',
  'emerald': 'text-white bg-emerald-600 hover:bg-emerald-600/90 dark:bg-emerald-600 dark:hover:bg-emerald-600/90',
  'teal': 'text-white bg-teal-600 hover:bg-teal-600/90 dark:bg-teal-600 dark:hover:bg-teal-600/90',
  'cyan': 'text-white bg-cyan-600 hover:bg-cyan-600/90 dark:bg-cyan-600 dark:hover:bg-cyan-600/90',
  'sky': 'text-white bg-sky-600 hover:bg-sky-600/90 dark:bg-sky-600 dark:hover:bg-sky-600/90',
  'blue': 'text-white bg-blue-600 hover:bg-blue-600/90 dark:bg-blue-600 dark:hover:bg-blue-600/90',
  'indigo': 'text-white bg-indigo-600 hover:bg-indigo-600/90 dark:bg-indigo-600 dark:hover:bg-indigo-600/90',
  'violet': 'text-white bg-violet-600 hover:bg-violet-600/90 dark:bg-violet-600 dark:hover:bg-violet-600/90',
  'purple': 'text-white bg-purple-600 hover:bg-purple-600/90 dark:bg-purple-600 dark:hover:bg-purple-600/90',
  'fuchsia': 'text-white bg-fuchsia-600 hover:bg-fuchsia-600/90 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-600/90',
  'pink': 'text-white bg-pink-600 hover:bg-pink-600/90 dark:bg-pink-600 dark:hover:bg-pink-600/90',
  'rose': 'text-white bg-rose-600 hover:bg-rose-600/90 dark:bg-rose-600 dark:hover:bg-rose-600/90',
}

export const OUTLINE_BUTTON_STYLES: Partial<Record<Colors, string>> = {
  'red': 'border text-red-600 border-red-600 hover:border-red-600/90 hover:bg-red-600/5 dark:text-red-400 dark:border-red-400 dark:hover:border-red-400/90 dark:hover:text-red-400 dark:hover:bg-red-400/5',
  'orange': 'border text-orange-600 border-orange-600 hover:border-orange-600/90 hover:bg-orange-600/5 dark:text-orange-400 dark:border-orange-400 dark:hover:border-orange-400/90 dark:hover:text-orange-400 dark:hover:bg-orange-400/5',
  'amber': 'border text-amber-600 border-amber-600 hover:border-amber-600/90 hover:bg-amber-600/5 dark:text-amber-400 dark:border-amber-400 dark:hover:border-amber-400/90 dark:hover:text-amber-400 dark:hover:bg-amber-400/5',
  'yellow': 'border text-yellow-600 border-yellow-600 hover:border-yellow-600/90 hover:bg-yellow-600/5 dark:text-yellow-400 dark:border-yellow-400 dark:hover:border-yellow-400/90 dark:hover:text-yellow-400 dark:hover:bg-yellow-400/5',
  'lime': 'border text-lime-600 border-lime-600 hover:border-lime-600/90 hover:bg-lime-600/5 dark:text-lime-400 dark:border-lime-400 dark:hover:border-lime-400/90 dark:hover:text-lime-400 dark:hover:bg-lime-400/5',
  'green': 'border text-green-600 border-green-600 hover:border-green-600/90 hover:bg-green-600/5 dark:text-green-400 dark:border-green-400 dark:hover:border-green-400/90 dark:hover:text-green-400 dark:hover:bg-green-400/5',
  'emerald': 'border text-emerald-600 border-emerald-600 hover:border-emerald-600/90 hover:bg-emerald-600/5 dark:text-emerald-400 dark:border-emerald-400 dark:hover:border-emerald-400/90 dark:hover:text-emerald-400 dark:hover:bg-emerald-400/5',
  'teal': 'border text-teal-600 border-teal-600 hover:border-teal-600/90 hover:bg-teal-600/5 dark:text-teal-400 dark:border-teal-400 dark:hover:border-teal-400/90 dark:hover:text-teal-400 dark:hover:bg-teal-400/5',
  'cyan': 'border text-cyan-600 border-cyan-600 hover:border-cyan-600/90 hover:bg-cyan-600/5 dark:text-cyan-400 dark:border-cyan-400 dark:hover:border-cyan-400/90 dark:hover:text-cyan-400 dark:hover:bg-cyan-400/5',
  'sky': 'border text-sky-600 border-sky-600 hover:border-sky-600/90 hover:bg-sky-600/5 dark:text-sky-400 dark:border-sky-400 dark:hover:border-sky-400/90 dark:hover:text-sky-400 dark:hover:bg-sky-400/5',
  'blue': 'border text-blue-600 border-blue-600 hover:border-blue-600/90 hover:bg-blue-600/5 dark:text-blue-400 dark:border-blue-400 dark:hover:border-blue-400/90 dark:hover:text-blue-400 dark:hover:bg-blue-400/5',
  'indigo': 'border text-indigo-600 border-indigo-600 hover:border-indigo-600/90 hover:bg-indigo-600/5 dark:text-indigo-400 dark:border-indigo-400 dark:hover:border-indigo-400/90 dark:hover:text-indigo-400 dark:hover:bg-indigo-400/5',
  'violet': 'border text-violet-600 border-violet-600 hover:border-violet-600/90 hover:bg-violet-600/5 dark:text-violet-400 dark:border-violet-400 dark:hover:border-violet-400/90 dark:hover:text-violet-400 dark:hover:bg-violet-400/5',
  'purple': 'border text-purple-600 border-purple-600 hover:border-purple-600/90 hover:bg-purple-600/5 dark:text-purple-400 dark:border-purple-400 dark:hover:border-purple-400/90 dark:hover:text-purple-400 dark:hover:bg-purple-400/5',
  'fuchsia': 'border text-fuchsia-600 border-fuchsia-600 hover:border-fuchsia-600/90 hover:bg-fuchsia-600/5 dark:text-fuchsia-400 dark:border-fuchsia-400 dark:hover:border-fuchsia-400/90 dark:hover:text-fuchsia-400 dark:hover:bg-fuchsia-400/5',
  'pink': 'border text-pink-600 border-pink-600 hover:border-pink-600/90 hover:bg-pink-600/5 dark:text-pink-400 dark:border-pink-400 dark:hover:border-pink-400/90 dark:hover:text-pink-400 dark:hover:bg-pink-400/5',
  'rose': 'border text-rose-600 border-rose-600 hover:border-rose-600/90 hover:bg-rose-600/5 dark:text-rose-400 dark:border-rose-400 dark:hover:border-rose-400/90 dark:hover:text-rose-400 dark:hover:bg-rose-400/5',
}

export const MOBILE_FILLED_BUTTON_STYLES: Partial<Record<Colors, string>> = {
  'red': 'bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white',
  'orange': 'bg-orange-600 hover:bg-orange-700 dark:hover:bg-orange-500 text-white',
  'amber': 'bg-amber-600 hover:bg-amber-700 dark:hover:bg-amber-500 text-white',
  'yellow': 'bg-yellow-600 hover:bg-yellow-700 dark:hover:bg-yellow-500 text-white',
  'lime': 'bg-lime-600 hover:bg-lime-700 dark:hover:bg-lime-500 text-white',
  'green': 'bg-green-600 hover:bg-green-700 dark:hover:bg-green-500 text-white',
  'emerald': 'bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white',
  'teal': 'bg-teal-600 hover:bg-teal-700 dark:hover:bg-teal-500 text-white',
  'cyan': 'bg-cyan-600 hover:bg-cyan-700 dark:hover:bg-cyan-500 text-white',
  'sky': 'bg-sky-600 hover:bg-sky-700 dark:hover:bg-sky-500 text-white',
  'blue': 'bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white',
  'indigo': 'bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white',
  'violet': 'bg-violet-600 hover:bg-violet-700 dark:hover:bg-violet-500 text-white',
  'purple': 'bg-purple-600 hover:bg-purple-700 dark:hover:bg-purple-500 text-white',
  'fuchsia': 'bg-fuchsia-600 hover:bg-fuchsia-700 dark:hover:bg-fuchsia-500 text-white',
  'pink': 'bg-pink-600 hover:bg-pink-700 dark:hover:bg-pink-500 text-white',
  'rose': 'bg-rose-600 hover:bg-rose-700 dark:hover:bg-rose-500 text-white',
}

export const ACCORDION_HEADER_STYLES: Partial<Record<Colors, string>> = {
  'red': 'data-[recommended=true]:text-red-500',
  'orange': 'data-[recommended=true]:text-orange-500',
  'amber': 'data-[recommended=true]:text-amber-500',
  'yellow': 'data-[recommended=true]:text-yellow-500',
  'lime': 'data-[recommended=true]:text-lime-500',
  'green': 'data-[recommended=true]:text-green-500',
  'emerald': 'data-[recommended=true]:text-emerald-500',
  'teal': 'data-[recommended=true]:text-teal-500',
  'cyan': 'data-[recommended=true]:text-cyan-500',
  'sky': 'data-[recommended=true]:text-sky-500',
  'blue': 'data-[recommended=true]:text-blue-500',
  'indigo': 'data-[recommended=true]:text-indigo-500',
  'violet': 'data-[recommended=true]:text-violet-500',
  'purple': 'data-[recommended=true]:text-purple-500',
  'fuchsia': 'data-[recommended=true]:text-fuchsia-500',
  'pink': 'data-[recommended=true]:text-pink-500',
  'rose': 'data-[recommended=true]:text-rose-600',
}
