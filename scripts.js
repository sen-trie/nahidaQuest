export function tabChange(x) {
    for (tab in TABS){
        TABS[tab].style.display = "none";
    }
    TABS[x-1].style.display = "flex";

     if (x-1 == 0 || x-1 == 1) {
        table6.style.display = "block";
     } else {
        table6.style.display = "none"; 
     }

     if (x-1 == 2) {
        expedDiv.style.display = "block";
     } else {
        expedDiv.style.display = "none";
     }
}


// TO DO SWITCH FROM TEXT/JAVASCRIPT TO MODULE