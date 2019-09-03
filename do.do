clear all
set more off

cd "C:\Users\oswaldo.zapata\Downloads\HW2 Dataviz"

insheet using "MOE-Result.Presi20182daV.Candidato-municipio.txt", names delim("|")

gen porc_cd = (ivnduque / votosvlidos)*100
rename code codmpio
merge 1:1 codmpio using iica.dta
drop if _merge==1

keep codmpio municipio depto iica iica_1 porc_cd
qui sum iica, detail
xtile decil_iica = iica, nq(10)
xtile cuartil_iica = iica, nq(4)
xtile mitad_iica = iica, nq(2)
xtile quintil_iica = iica, nq(5)
xtile veinte_iica = iica, nq(20)

*graph hbox porc_cd, by(veinte_iica)

export delimited using "hw2.csv", replace


gen decil="Decil 10 IICA" if decil_iica==10
replace decil="Decil 1 IICA" if decil_iica==1

keep if decil!=""
keep codmpio municipio depto porc_cd decil

export delimited using "hw2_decil.csv", replace
