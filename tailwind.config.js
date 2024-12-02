/** @type {import('tailwindcss').Config} */

export default {

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}"
  ],
 
  theme: {
    
    
    extend: {
      backgroundImage: {
        'header': "url('../MiniProjet/public/bgimage.jpg')"
        
      },
      colors: {
        'blue': '#004e98',
        'blueActive': '#044389',
        'orange': '#ff6d00',
        'orangeActive': '#f55200',
        'grey': '#f3f3f0',
        'greyTwo':'#f9f9f8',
        'greyLink': '#373d4f',
        'greyThree' : '#f7f7f7',
        'greyActive' : '#e7e7e2',
        'greytext' : '#6c757d',
        'greysec' : '#edecf0',
        'red' : '#CC0000'
      },
      fontFamily : {
        'title':['Playfair Display'],
        'body': ["Manrope", 'sans-serif']
      },
    }
  },
  plugins: ["prettier-plugin-tailwindcss"],
}