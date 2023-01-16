function abbrNum(number) {
   let decPlaces = Math.pow(10, 2);
   var abbrev = [""," Million"," Billion"," Trillion"," Quadrillion"," Quintillion"," Sextillion"," Septillion"];

   if (number > 1e6) {
       for (var i = abbrev.length - 1; i >= 0; i--) {
           var size = Math.pow(10, (i + 1) * 3);
           if (size <= number) {
               number = Math.round((number * decPlaces) / size) / decPlaces;
               if (number == 1000 && i < abbrev.length - 1) {
                       number = 1;
                       i++;
                   }
               number += abbrev[i];
               break;
           }
       }
       return number;
   } else {
       number = Math.round(number);
       return number;
   }
};

export { abbrNum };
