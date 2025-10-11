"use client"

import { useEffect, useState } from "react"
import { Users, EyeOff, Eye, IndianRupee, Lock, Smartphone } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useGetuser from "../hooks/user"
import loginImage from "../assets/login.png"

const Login = () => {
    const user = useGetuser();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        phonenumber: "",
        password: "",
    })
    const [selectedCountry, setSelectedCountry] = useState({
        code: "IN",
        dialCode: "+91",
        name: "India",
        flag: "https://flagcdn.com/w320/in.png"
    })
    const [showCountryDropdown, setShowCountryDropdown] = useState(false)
    const [countrySearchTerm, setCountrySearchTerm] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Country codes data with flag URLs
    const countryCodes = [
        { code: "AF", dialCode: "+93", name: "Afghanistan", flag: "https://flagcdn.com/w320/af.png" },
        { code: "AX", dialCode: "+358", name: "Åland Islands", flag: "https://flagcdn.com/w320/ax.png" },
        { code: "AL", dialCode: "+355", name: "Albania", flag: "https://flagcdn.com/w320/al.png" },
        { code: "DZ", dialCode: "+213", name: "Algeria", flag: "https://flagcdn.com/w320/dz.png" },
        { code: "AS", dialCode: "+1684", name: "American Samoa", flag: "https://flagcdn.com/w320/as.png" },
        { code: "AD", dialCode: "+376", name: "Andorra", flag: "https://flagcdn.com/w320/ad.png" },
        { code: "AO", dialCode: "+244", name: "Angola", flag: "https://flagcdn.com/w320/ao.png" },
        { code: "AI", dialCode: "+1264", name: "Anguilla", flag: "https://flagcdn.com/w320/ai.png" },
        { code: "AQ", dialCode: "+672", name: "Antarctica", flag: "https://flagcdn.com/w320/aq.png" },
        { code: "AG", dialCode: "+1268", name: "Antigua and Barbuda", flag: "https://flagcdn.com/w320/ag.png" },
        { code: "AR", dialCode: "+54", name: "Argentina", flag: "https://flagcdn.com/w320/ar.png" },
        { code: "AM", dialCode: "+374", name: "Armenia", flag: "https://flagcdn.com/w320/am.png" },
        { code: "AW", dialCode: "+297", name: "Aruba", flag: "https://flagcdn.com/w320/aw.png" },
        { code: "AU", dialCode: "+61", name: "Australia", flag: "https://flagcdn.com/w320/au.png" },
        { code: "AT", dialCode: "+43", name: "Austria", flag: "https://flagcdn.com/w320/at.png" },
        { code: "AZ", dialCode: "+994", name: "Azerbaijan", flag: "https://flagcdn.com/w320/az.png" },
        { code: "BS", dialCode: "+1242", name: "Bahamas", flag: "https://flagcdn.com/w320/bs.png" },
        { code: "BH", dialCode: "+973", name: "Bahrain", flag: "https://flagcdn.com/w320/bh.png" },
        { code: "BD", dialCode: "+880", name: "Bangladesh", flag: "https://flagcdn.com/w320/bd.png" },
        { code: "BB", dialCode: "+1246", name: "Barbados", flag: "https://flagcdn.com/w320/bb.png" },
        { code: "BY", dialCode: "+375", name: "Belarus", flag: "https://flagcdn.com/w320/by.png" },
        { code: "BE", dialCode: "+32", name: "Belgium", flag: "https://flagcdn.com/w320/be.png" },
        { code: "BZ", dialCode: "+501", name: "Belize", flag: "https://flagcdn.com/w320/bz.png" },
        { code: "BJ", dialCode: "+229", name: "Benin", flag: "https://flagcdn.com/w320/bj.png" },
        { code: "BM", dialCode: "+1441", name: "Bermuda", flag: "https://flagcdn.com/w320/bm.png" },
        { code: "BT", dialCode: "+975", name: "Bhutan", flag: "https://flagcdn.com/w320/bt.png" },
        { code: "BO", dialCode: "+591", name: "Bolivia", flag: "https://flagcdn.com/w320/bo.png" },
        { code: "BA", dialCode: "+387", name: "Bosnia and Herzegovina", flag: "https://flagcdn.com/w320/ba.png" },
        { code: "BW", dialCode: "+267", name: "Botswana", flag: "https://flagcdn.com/w320/bw.png" },
        { code: "BR", dialCode: "+55", name: "Brazil", flag: "https://flagcdn.com/w320/br.png" },
        { code: "IO", dialCode: "+246", name: "British Indian Ocean Territory", flag: "https://flagcdn.com/w320/io.png" },
        { code: "BN", dialCode: "+673", name: "Brunei Darussalam", flag: "https://flagcdn.com/w320/bn.png" },
        { code: "BG", dialCode: "+359", name: "Bulgaria", flag: "https://flagcdn.com/w320/bg.png" },
        { code: "BF", dialCode: "+226", name: "Burkina Faso", flag: "https://flagcdn.com/w320/bf.png" },
        { code: "BI", dialCode: "+257", name: "Burundi", flag: "https://flagcdn.com/w320/bi.png" },
        { code: "KH", dialCode: "+855", name: "Cambodia", flag: "https://flagcdn.com/w320/kh.png" },
        { code: "CM", dialCode: "+237", name: "Cameroon", flag: "https://flagcdn.com/w320/cm.png" },
        { code: "CA", dialCode: "+1", name: "Canada", flag: "https://flagcdn.com/w320/ca.png" },
        { code: "CV", dialCode: "+238", name: "Cape Verde", flag: "https://flagcdn.com/w320/cv.png" },
        { code: "KY", dialCode: "+1345", name: "Cayman Islands", flag: "https://flagcdn.com/w320/ky.png" },
        { code: "CF", dialCode: "+236", name: "Central African Republic", flag: "https://flagcdn.com/w320/cf.png" },
        { code: "TD", dialCode: "+235", name: "Chad", flag: "https://flagcdn.com/w320/td.png" },
        { code: "CL", dialCode: "+56", name: "Chile", flag: "https://flagcdn.com/w320/cl.png" },
        { code: "CN", dialCode: "+86", name: "China", flag: "https://flagcdn.com/w320/cn.png" },
        { code: "CX", dialCode: "+61", name: "Christmas Island", flag: "https://flagcdn.com/w320/cx.png" },
        { code: "CC", dialCode: "+61", name: "Cocos (Keeling) Islands", flag: "https://flagcdn.com/w320/cc.png" },
        { code: "CO", dialCode: "+57", name: "Colombia", flag: "https://flagcdn.com/w320/co.png" },
        { code: "KM", dialCode: "+269", name: "Comoros", flag: "https://flagcdn.com/w320/km.png" },
        { code: "CG", dialCode: "+242", name: "Congo", flag: "https://flagcdn.com/w320/cg.png" },
        { code: "CD", dialCode: "+243", name: "Congo, The Democratic Republic of the", flag: "https://flagcdn.com/w320/cd.png" },
        { code: "CK", dialCode: "+682", name: "Cook Islands", flag: "https://flagcdn.com/w320/ck.png" },
        { code: "CR", dialCode: "+506", name: "Costa Rica", flag: "https://flagcdn.com/w320/cr.png" },
        { code: "CI", dialCode: "+225", name: "Cote D'Ivoire", flag: "https://flagcdn.com/w320/ci.png" },
        { code: "HR", dialCode: "+385", name: "Croatia", flag: "https://flagcdn.com/w320/hr.png" },
        { code: "CU", dialCode: "+53", name: "Cuba", flag: "https://flagcdn.com/w320/cu.png" },
        { code: "CY", dialCode: "+357", name: "Cyprus", flag: "https://flagcdn.com/w320/cy.png" },
        { code: "CZ", dialCode: "+420", name: "Czech Republic", flag: "https://flagcdn.com/w320/cz.png" },
        { code: "DK", dialCode: "+45", name: "Denmark", flag: "https://flagcdn.com/w320/dk.png" },
        { code: "DJ", dialCode: "+253", name: "Djibouti", flag: "https://flagcdn.com/w320/dj.png" },
        { code: "DM", dialCode: "+1767", name: "Dominica", flag: "https://flagcdn.com/w320/dm.png" },
        { code: "DO", dialCode: "+1849", name: "Dominican Republic", flag: "https://flagcdn.com/w320/do.png" },
        { code: "EC", dialCode: "+593", name: "Ecuador", flag: "https://flagcdn.com/w320/ec.png" },
        { code: "EG", dialCode: "+20", name: "Egypt", flag: "https://flagcdn.com/w320/eg.png" },
        { code: "SV", dialCode: "+503", name: "El Salvador", flag: "https://flagcdn.com/w320/sv.png" },
        { code: "GQ", dialCode: "+240", name: "Equatorial Guinea", flag: "https://flagcdn.com/w320/gq.png" },
        { code: "ER", dialCode: "+291", name: "Eritrea", flag: "https://flagcdn.com/w320/er.png" },
        { code: "EE", dialCode: "+372", name: "Estonia", flag: "https://flagcdn.com/w320/ee.png" },
        { code: "ET", dialCode: "+251", name: "Ethiopia", flag: "https://flagcdn.com/w320/et.png" },
        { code: "FK", dialCode: "+500", name: "Falkland Islands (Malvinas)", flag: "https://flagcdn.com/w320/fk.png" },
        { code: "FO", dialCode: "+298", name: "Faroe Islands", flag: "https://flagcdn.com/w320/fo.png" },
        { code: "FJ", dialCode: "+679", name: "Fiji", flag: "https://flagcdn.com/w320/fj.png" },
        { code: "FI", dialCode: "+358", name: "Finland", flag: "https://flagcdn.com/w320/fi.png" },
        { code: "FR", dialCode: "+33", name: "France", flag: "https://flagcdn.com/w320/fr.png" },
        { code: "GF", dialCode: "+594", name: "French Guiana", flag: "https://flagcdn.com/w320/gf.png" },
        { code: "PF", dialCode: "+689", name: "French Polynesia", flag: "https://flagcdn.com/w320/pf.png" },
        { code: "GA", dialCode: "+241", name: "Gabon", flag: "https://flagcdn.com/w320/ga.png" },
        { code: "GM", dialCode: "+220", name: "Gambia", flag: "https://flagcdn.com/w320/gm.png" },
        { code: "GE", dialCode: "+995", name: "Georgia", flag: "https://flagcdn.com/w320/ge.png" },
        { code: "DE", dialCode: "+49", name: "Germany", flag: "https://flagcdn.com/w320/de.png" },
        { code: "GH", dialCode: "+233", name: "Ghana", flag: "https://flagcdn.com/w320/gh.png" },
        { code: "GI", dialCode: "+350", name: "Gibraltar", flag: "https://flagcdn.com/w320/gi.png" },
        { code: "GR", dialCode: "+30", name: "Greece", flag: "https://flagcdn.com/w320/gr.png" },
        { code: "GL", dialCode: "+299", name: "Greenland", flag: "https://flagcdn.com/w320/gl.png" },
        { code: "GD", dialCode: "+1473", name: "Grenada", flag: "https://flagcdn.com/w320/gd.png" },
        { code: "GP", dialCode: "+590", name: "Guadeloupe", flag: "https://flagcdn.com/w320/gp.png" },
        { code: "GU", dialCode: "+1671", name: "Guam", flag: "https://flagcdn.com/w320/gu.png" },
        { code: "GT", dialCode: "+502", name: "Guatemala", flag: "https://flagcdn.com/w320/gt.png" },
        { code: "GG", dialCode: "+44", name: "Guernsey", flag: "https://flagcdn.com/w320/gg.png" },
        { code: "GN", dialCode: "+224", name: "Guinea", flag: "https://flagcdn.com/w320/gn.png" },
        { code: "GW", dialCode: "+245", name: "Guinea-Bissau", flag: "https://flagcdn.com/w320/gw.png" },
        { code: "GY", dialCode: "+592", name: "Guyana", flag: "https://flagcdn.com/w320/gy.png" },
        { code: "HT", dialCode: "+509", name: "Haiti", flag: "https://flagcdn.com/w320/ht.png" },
        { code: "VA", dialCode: "+379", name: "Holy See (Vatican City State)", flag: "https://flagcdn.com/w320/va.png" },
        { code: "HN", dialCode: "+504", name: "Honduras", flag: "https://flagcdn.com/w320/hn.png" },
        { code: "HK", dialCode: "+852", name: "Hong Kong", flag: "https://flagcdn.com/w320/hk.png" },
        { code: "HU", dialCode: "+36", name: "Hungary", flag: "https://flagcdn.com/w320/hu.png" },
        { code: "IS", dialCode: "+354", name: "Iceland", flag: "https://flagcdn.com/w320/is.png" },
        { code: "IN", dialCode: "+91", name: "India", flag: "https://flagcdn.com/w320/in.png" },
        { code: "ID", dialCode: "+62", name: "Indonesia", flag: "https://flagcdn.com/w320/id.png" },
        { code: "IR", dialCode: "+98", name: "Iran, Islamic Republic of", flag: "https://flagcdn.com/w320/ir.png" },
        { code: "IQ", dialCode: "+964", name: "Iraq", flag: "https://flagcdn.com/w320/iq.png" },
        { code: "IE", dialCode: "+353", name: "Ireland", flag: "https://flagcdn.com/w320/ie.png" },
        { code: "IM", dialCode: "+44", name: "Isle of Man", flag: "https://flagcdn.com/w320/im.png" },
        { code: "IL", dialCode: "+972", name: "Israel", flag: "https://flagcdn.com/w320/il.png" },
        { code: "IT", dialCode: "+39", name: "Italy", flag: "https://flagcdn.com/w320/it.png" },
        { code: "JM", dialCode: "+1876", name: "Jamaica", flag: "https://flagcdn.com/w320/jm.png" },
        { code: "JP", dialCode: "+81", name: "Japan", flag: "https://flagcdn.com/w320/jp.png" },
        { code: "JE", dialCode: "+44", name: "Jersey", flag: "https://flagcdn.com/w320/je.png" },
        { code: "JO", dialCode: "+962", name: "Jordan", flag: "https://flagcdn.com/w320/jo.png" },
        { code: "KZ", dialCode: "+7", name: "Kazakhstan", flag: "https://flagcdn.com/w320/kz.png" },
        { code: "KE", dialCode: "+254", name: "Kenya", flag: "https://flagcdn.com/w320/ke.png" },
        { code: "KI", dialCode: "+686", name: "Kiribati", flag: "https://flagcdn.com/w320/ki.png" },
        { code: "KP", dialCode: "+850", name: "Korea, Democratic People's Republic of", flag: "https://flagcdn.com/w320/kp.png" },
        { code: "KR", dialCode: "+82", name: "South Korea", flag: "https://flagcdn.com/w320/kr.png" },
        { code: "KW", dialCode: "+965", name: "Kuwait", flag: "https://flagcdn.com/w320/kw.png" },
        { code: "KG", dialCode: "+996", name: "Kyrgyzstan", flag: "https://flagcdn.com/w320/kg.png" },
        { code: "LA", dialCode: "+856", name: "Lao People's Democratic Republic", flag: "https://flagcdn.com/w320/la.png" },
        { code: "LV", dialCode: "+371", name: "Latvia", flag: "https://flagcdn.com/w320/lv.png" },
        { code: "LB", dialCode: "+961", name: "Lebanon", flag: "https://flagcdn.com/w320/lb.png" },
        { code: "LS", dialCode: "+266", name: "Lesotho", flag: "https://flagcdn.com/w320/ls.png" },
        { code: "LR", dialCode: "+231", name: "Liberia", flag: "https://flagcdn.com/w320/lr.png" },
        { code: "LY", dialCode: "+218", name: "Libyan Arab Jamahiriya", flag: "https://flagcdn.com/w320/ly.png" },
        { code: "LI", dialCode: "+423", name: "Liechtenstein", flag: "https://flagcdn.com/w320/li.png" },
        { code: "LT", dialCode: "+370", name: "Lithuania", flag: "https://flagcdn.com/w320/lt.png" },
        { code: "LU", dialCode: "+352", name: "Luxembourg", flag: "https://flagcdn.com/w320/lu.png" },
        { code: "MO", dialCode: "+853", name: "Macao", flag: "https://flagcdn.com/w320/mo.png" },
        { code: "MK", dialCode: "+389", name: "Macedonia, The Former Yugoslav Republic of", flag: "https://flagcdn.com/w320/mk.png" },
        { code: "MG", dialCode: "+261", name: "Madagascar", flag: "https://flagcdn.com/w320/mg.png" },
        { code: "MW", dialCode: "+265", name: "Malawi", flag: "https://flagcdn.com/w320/mw.png" },
        { code: "MY", dialCode: "+60", name: "Malaysia", flag: "https://flagcdn.com/w320/my.png" },
        { code: "MV", dialCode: "+960", name: "Maldives", flag: "https://flagcdn.com/w320/mv.png" },
        { code: "ML", dialCode: "+223", name: "Mali", flag: "https://flagcdn.com/w320/ml.png" },
        { code: "MT", dialCode: "+356", name: "Malta", flag: "https://flagcdn.com/w320/mt.png" },
        { code: "MH", dialCode: "+692", name: "Marshall Islands", flag: "https://flagcdn.com/w320/mh.png" },
        { code: "MQ", dialCode: "+596", name: "Martinique", flag: "https://flagcdn.com/w320/mq.png" },
        { code: "MR", dialCode: "+222", name: "Mauritania", flag: "https://flagcdn.com/w320/mr.png" },
        { code: "MU", dialCode: "+230", name: "Mauritius", flag: "https://flagcdn.com/w320/mu.png" },
        { code: "YT", dialCode: "+262", name: "Mayotte", flag: "https://flagcdn.com/w320/yt.png" },
        { code: "MX", dialCode: "+52", name: "Mexico", flag: "https://flagcdn.com/w320/mx.png" },
        { code: "FM", dialCode: "+691", name: "Micronesia, Federated States of", flag: "https://flagcdn.com/w320/fm.png" },
        { code: "MD", dialCode: "+373", name: "Moldova, Republic of", flag: "https://flagcdn.com/w320/md.png" },
        { code: "MC", dialCode: "+377", name: "Monaco", flag: "https://flagcdn.com/w320/mc.png" },
        { code: "MN", dialCode: "+976", name: "Mongolia", flag: "https://flagcdn.com/w320/mn.png" },
        { code: "ME", dialCode: "+382", name: "Montenegro", flag: "https://flagcdn.com/w320/me.png" },
        { code: "MS", dialCode: "+1664", name: "Montserrat", flag: "https://flagcdn.com/w320/ms.png" },
        { code: "MA", dialCode: "+212", name: "Morocco", flag: "https://flagcdn.com/w320/ma.png" },
        { code: "MZ", dialCode: "+258", name: "Mozambique", flag: "https://flagcdn.com/w320/mz.png" },
        { code: "MM", dialCode: "+95", name: "Myanmar", flag: "https://flagcdn.com/w320/mm.png" },
        { code: "NA", dialCode: "+264", name: "Namibia", flag: "https://flagcdn.com/w320/na.png" },
        { code: "NR", dialCode: "+674", name: "Nauru", flag: "https://flagcdn.com/w320/nr.png" },
        { code: "NP", dialCode: "+977", name: "Nepal", flag: "https://flagcdn.com/w320/np.png" },
        { code: "NL", dialCode: "+31", name: "Netherlands", flag: "https://flagcdn.com/w320/nl.png" },
        { code: "NC", dialCode: "+687", name: "New Caledonia", flag: "https://flagcdn.com/w320/nc.png" },
        { code: "NZ", dialCode: "+64", name: "New Zealand", flag: "https://flagcdn.com/w320/nz.png" },
        { code: "NI", dialCode: "+505", name: "Nicaragua", flag: "https://flagcdn.com/w320/ni.png" },
        { code: "NE", dialCode: "+227", name: "Niger", flag: "https://flagcdn.com/w320/ne.png" },
        { code: "NG", dialCode: "+234", name: "Nigeria", flag: "https://flagcdn.com/w320/ng.png" },
        { code: "NU", dialCode: "+683", name: "Niue", flag: "https://flagcdn.com/w320/nu.png" },
        { code: "NF", dialCode: "+672", name: "Norfolk Island", flag: "https://flagcdn.com/w320/nf.png" },
        { code: "MP", dialCode: "+1670", name: "Northern Mariana Islands", flag: "https://flagcdn.com/w320/mp.png" },
        { code: "NO", dialCode: "+47", name: "Norway", flag: "https://flagcdn.com/w320/no.png" },
        { code: "OM", dialCode: "+968", name: "Oman", flag: "https://flagcdn.com/w320/om.png" },
        { code: "PK", dialCode: "+92", name: "Pakistan", flag: "https://flagcdn.com/w320/pk.png" },
        { code: "PW", dialCode: "+680", name: "Palau", flag: "https://flagcdn.com/w320/pw.png" },
        { code: "PS", dialCode: "+970", name: "Palestinian Territory, Occupied", flag: "https://flagcdn.com/w320/ps.png" },
        { code: "PA", dialCode: "+507", name: "Panama", flag: "https://flagcdn.com/w320/pa.png" },
        { code: "PG", dialCode: "+675", name: "Papua New Guinea", flag: "https://flagcdn.com/w320/pg.png" },
        { code: "PY", dialCode: "+595", name: "Paraguay", flag: "https://flagcdn.com/w320/py.png" },
        { code: "PE", dialCode: "+51", name: "Peru", flag: "https://flagcdn.com/w320/pe.png" },
        { code: "PH", dialCode: "+63", name: "Philippines", flag: "https://flagcdn.com/w320/ph.png" },
        { code: "PN", dialCode: "+64", name: "Pitcairn", flag: "https://flagcdn.com/w320/pn.png" },
        { code: "PL", dialCode: "+48", name: "Poland", flag: "https://flagcdn.com/w320/pl.png" },
        { code: "PT", dialCode: "+351", name: "Portugal", flag: "https://flagcdn.com/w320/pt.png" },
        { code: "PR", dialCode: "+1939", name: "Puerto Rico", flag: "https://flagcdn.com/w320/pr.png" },
        { code: "QA", dialCode: "+974", name: "Qatar", flag: "https://flagcdn.com/w320/qa.png" },
        { code: "RO", dialCode: "+40", name: "Romania", flag: "https://flagcdn.com/w320/ro.png" },
        { code: "RU", dialCode: "+7", name: "Russia", flag: "https://flagcdn.com/w320/ru.png" },
        { code: "RW", dialCode: "+250", name: "Rwanda", flag: "https://flagcdn.com/w320/rw.png" },
        { code: "BL", dialCode: "+590", name: "Saint Barthélemy", flag: "https://flagcdn.com/w320/bl.png" },
        { code: "SH", dialCode: "+290", name: "Saint Helena, Ascension and Tristan Da Cunha", flag: "https://flagcdn.com/w320/sh.png" },
        { code: "KN", dialCode: "+1869", name: "Saint Kitts and Nevis", flag: "https://flagcdn.com/w320/kn.png" },
        { code: "LC", dialCode: "+1758", name: "Saint Lucia", flag: "https://flagcdn.com/w320/lc.png" },
        { code: "MF", dialCode: "+590", name: "Saint Martin", flag: "https://flagcdn.com/w320/mf.png" },
        { code: "PM", dialCode: "+508", name: "Saint Pierre and Miquelon", flag: "https://flagcdn.com/w320/pm.png" },
        { code: "VC", dialCode: "+1784", name: "Saint Vincent and the Grenadines", flag: "https://flagcdn.com/w320/vc.png" },
        { code: "WS", dialCode: "+685", name: "Samoa", flag: "https://flagcdn.com/w320/ws.png" },
        { code: "SM", dialCode: "+378", name: "San Marino", flag: "https://flagcdn.com/w320/sm.png" },
        { code: "ST", dialCode: "+239", name: "Sao Tome and Principe", flag: "https://flagcdn.com/w320/st.png" },
        { code: "SA", dialCode: "+966", name: "Saudi Arabia", flag: "https://flagcdn.com/w320/sa.png" },
        { code: "SN", dialCode: "+221", name: "Senegal", flag: "https://flagcdn.com/w320/sn.png" },
        { code: "RS", dialCode: "+381", name: "Serbia", flag: "https://flagcdn.com/w320/rs.png" },
        { code: "SC", dialCode: "+248", name: "Seychelles", flag: "https://flagcdn.com/w320/sc.png" },
        { code: "SL", dialCode: "+232", name: "Sierra Leone", flag: "https://flagcdn.com/w320/sl.png" },
        { code: "SG", dialCode: "+65", name: "Singapore", flag: "https://flagcdn.com/w320/sg.png" },
        { code: "SK", dialCode: "+421", name: "Slovakia", flag: "https://flagcdn.com/w320/sk.png" },
        { code: "SI", dialCode: "+386", name: "Slovenia", flag: "https://flagcdn.com/w320/si.png" },
        { code: "SB", dialCode: "+677", name: "Solomon Islands", flag: "https://flagcdn.com/w320/sb.png" },
        { code: "SO", dialCode: "+252", name: "Somalia", flag: "https://flagcdn.com/w320/so.png" },
        { code: "ZA", dialCode: "+27", name: "South Africa", flag: "https://flagcdn.com/w320/za.png" },
        { code: "GS", dialCode: "+500", name: "South Georgia and the South Sandwich Islands", flag: "https://flagcdn.com/w320/gs.png" },
        { code: "ES", dialCode: "+34", name: "Spain", flag: "https://flagcdn.com/w320/es.png" },
        { code: "LK", dialCode: "+94", name: "Sri Lanka", flag: "https://flagcdn.com/w320/lk.png" },
        { code: "SD", dialCode: "+249", name: "Sudan", flag: "https://flagcdn.com/w320/sd.png" },
        { code: "SR", dialCode: "+597", name: "Suriname", flag: "https://flagcdn.com/w320/sr.png" },
        { code: "SJ", dialCode: "+47", name: "Svalbard and Jan Mayen", flag: "https://flagcdn.com/w320/sj.png" },
        { code: "SZ", dialCode: "+268", name: "Swaziland", flag: "https://flagcdn.com/w320/sz.png" },
        { code: "SE", dialCode: "+46", name: "Sweden", flag: "https://flagcdn.com/w320/se.png" },
        { code: "CH", dialCode: "+41", name: "Switzerland", flag: "https://flagcdn.com/w320/ch.png" },
        { code: "SY", dialCode: "+963", name: "Syrian Arab Republic", flag: "https://flagcdn.com/w320/sy.png" },
        { code: "TW", dialCode: "+886", name: "Taiwan", flag: "https://flagcdn.com/w320/tw.png" },
        { code: "TJ", dialCode: "+992", name: "Tajikistan", flag: "https://flagcdn.com/w320/tj.png" },
        { code: "TZ", dialCode: "+255", name: "Tanzania, United Republic of", flag: "https://flagcdn.com/w320/tz.png" },
        { code: "TH", dialCode: "+66", name: "Thailand", flag: "https://flagcdn.com/w320/th.png" },
        { code: "TL", dialCode: "+670", name: "Timor-Leste", flag: "https://flagcdn.com/w320/tl.png" },
        { code: "TG", dialCode: "+228", name: "Togo", flag: "https://flagcdn.com/w320/tg.png" },
        { code: "TK", dialCode: "+690", name: "Tokelau", flag: "https://flagcdn.com/w320/tk.png" },
        { code: "TO", dialCode: "+676", name: "Tonga", flag: "https://flagcdn.com/w320/to.png" },
        { code: "TT", dialCode: "+1868", name: "Trinidad and Tobago", flag: "https://flagcdn.com/w320/tt.png" },
        { code: "TN", dialCode: "+216", name: "Tunisia", flag: "https://flagcdn.com/w320/tn.png" },
        { code: "TR", dialCode: "+90", name: "Turkey", flag: "https://flagcdn.com/w320/tr.png" },
        { code: "TM", dialCode: "+993", name: "Turkmenistan", flag: "https://flagcdn.com/w320/tm.png" },
        { code: "TC", dialCode: "+1649", name: "Turks and Caicos Islands", flag: "https://flagcdn.com/w320/tc.png" },
        { code: "TV", dialCode: "+688", name: "Tuvalu", flag: "https://flagcdn.com/w320/tv.png" },
        { code: "UG", dialCode: "+256", name: "Uganda", flag: "https://flagcdn.com/w320/ug.png" },
        { code: "UA", dialCode: "+380", name: "Ukraine", flag: "https://flagcdn.com/w320/ua.png" },
        { code: "AE", dialCode: "+971", name: "UAE", flag: "https://flagcdn.com/w320/ae.png" },
        { code: "GB", dialCode: "+44", name: "United Kingdom", flag: "https://flagcdn.com/w320/gb.png" },
        { code: "US", dialCode: "+1", name: "United States", flag: "https://flagcdn.com/w320/us.png" },
        { code: "UY", dialCode: "+598", name: "Uruguay", flag: "https://flagcdn.com/w320/uy.png" },
        { code: "UZ", dialCode: "+998", name: "Uzbekistan", flag: "https://flagcdn.com/w320/uz.png" },
        { code: "VU", dialCode: "+678", name: "Vanuatu", flag: "https://flagcdn.com/w320/vu.png" },
        { code: "VE", dialCode: "+58", name: "Venezuela, Bolivarian Republic of", flag: "https://flagcdn.com/w320/ve.png" },
        { code: "VN", dialCode: "+84", name: "Vietnam", flag: "https://flagcdn.com/w320/vn.png" },
        { code: "VG", dialCode: "+1284", name: "Virgin Islands, British", flag: "https://flagcdn.com/w320/vg.png" },
        { code: "VI", dialCode: "+1340", name: "Virgin Islands, U.S.", flag: "https://flagcdn.com/w320/vi.png" },
        { code: "WF", dialCode: "+681", name: "Wallis and Futuna", flag: "https://flagcdn.com/w320/wf.png" },
        { code: "YE", dialCode: "+967", name: "Yemen", flag: "https://flagcdn.com/w320/ye.png" },
        { code: "ZM", dialCode: "+260", name: "Zambia", flag: "https://flagcdn.com/w320/zm.png" },
        { code: "ZW", dialCode: "+263", name: "Zimbabwe", flag: "https://flagcdn.com/w320/zw.png" },
    ];

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate])

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showCountryDropdown && !event.target.closest('.country-dropdown')) {
                setShowCountryDropdown(false)
                setCountrySearchTerm("")
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showCountryDropdown])

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleCountryChange = (country) => {
        setSelectedCountry(country)
        setShowCountryDropdown(false)
        setCountrySearchTerm("")
    }

    const handleCountrySearch = (e) => {
        setCountrySearchTerm(e.target.value)
    }

    const filteredCountries = countryCodes.filter(country =>
        country.code.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
        country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
        country.dialCode.includes(countrySearchTerm)
    )

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post("https://lightsteelblue-woodcock-286554.hostingersite.com/api/login", {
                phonenumber: formData.phonenumber,
                password: formData.password
            });

            if (response.status === 200 && response.data.success) {
                // Store token and user info as needed
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                toast.success("Login successful!", {
                    position: "top-right",
                    autoClose: 2000,
                });
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1000);
            } else {
                toast.error("Login failed. Please check your credentials.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Error during login. Please try again later.", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen">
            <div className="min-h-screen  max-w-md mx-auto bg-gradient-to-br from-green-100 via-white to-blue-50">
                {/* Logo */}
                <div className="text-center">
                    <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/png-logo-j9moV4DkAQHKCtbAK5mKGOyrYzxFGO.png"
                        alt="Yoga For Nation Logo"
                        className="h-40 mx-auto drop-shadow-md"
                    />
                </div>

                {/* Main Heading */}
                <div className="text-center">

                    <h1 className="text-3xl font-bold text-green-700 mb-2">FREE ONLINE YOGA</h1>
                    <div className="flex items-center justify-center">
                        <div className="w-6 h-0.5 bg-green-500 mr-2"></div>
                        <p className="text-lg text-blue-600 font-medium">A Movement for a Healthier Nation</p>
                        <div className="w-6 h-0.5 bg-green-500 ml-2"></div>
                    </div>
                </div>

                {/* Instructor Section */}
                <div className="mb-10 text-center relative bg-white
                 [mask-image:radial-gradient(circle,rgba(255,255,255,1)_70%,rgba(255,255,255,0)_100%)]
                 [-webkit-mask-image:radial-gradient(circle,rgba(255,255,255,1)_70%,rgba(255,255,255,0)_100%)]
                 [mask-repeat:no-repeat] [mask-position:center] [mask-size:cover]">
                    <div className="relative inline-block">
                        <img
                            src={loginImage}
                            alt="Lovnish Gupta"
                            className="object-cover"
                        />
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-full px-4  bg-white
                 [mask-image:radial-gradient(circle,rgba(255,255,255,1)_70%,rgba(255,255,255,0)_100%)]
                 [-webkit-mask-image:radial-gradient(circle,rgba(255,255,255,1)_70%,rgba(255,255,255,0)_100%)]
                 [mask-repeat:no-repeat] [mask-position:center] [mask-size:cover] pb-4">
                            <div className="text-center leading-none">
                                <h2 className="text-green-700 font-bold uppercase tracking-wide text-2xl">
                                    Lovnish Gupta
                                </h2>
                                <p className="mt-1 text-slate-900 font-extrabold">
                                    Govt Certified Yoga Teacher
                                </p>
                                <p className="text-slate-600 text-sm">
                                    IIT Graduate | 12+ Years Exp.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Registration Form */}
                <div className="rounded-2xl px-6">
                    {/* <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Welcome Back</h3> */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Phone Input */}
                        <div className="relative">
                            <div className="flex mt-10">
                                <div className="relative country-dropdown">
                                    {/* Custom Country Dropdown */}
                                    <button
                                        type="button"
                                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                        className="p-3 pl-12 pr-4  border border-gray-300 rounded-l-lg bg-gray-100 text-sm font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-[100px] flex items-center justify-between"
                                    >
                                        <span>{selectedCountry.dialCode}</span>
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Selected Country Flag */}
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <img
                                            src={selectedCountry.flag}
                                            alt={selectedCountry.name}
                                            className="h-6 w-8 object-cover rounded-sm border border-gray-200"
                                        />
                                    </div>

                                    {/* Dropdown Menu */}
                                    {showCountryDropdown && (
                                        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-hidden">
                                            {/* Search Input */}
                                            <div className="p-3 border-b border-gray-200">
                                                <input
                                                    type="text"
                                                    placeholder="Search by country code or name..."
                                                    value={countrySearchTerm}
                                                    onChange={handleCountrySearch}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                                                />
                                            </div>

                                            {/* Country Options */}
                                            <div className="overflow-y-auto max-h-40">
                                                {filteredCountries.map((country) => (
                                                    <button
                                                        key={country.code}
                                                        type="button"
                                                        onClick={() => handleCountryChange(country)}
                                                        className="w-full px-3 py-2 flex items-center gap-3 hover:bg-gray-100 text-left text-sm"
                                                    >
                                                        <img
                                                            src={country.flag}
                                                            alt={country.name}
                                                            className="h-5 w-7 object-cover rounded-sm border border-gray-200"
                                                        />
                                                        <span className="font-medium">{country.code}</span>
                                                        <span className="text-gray-600">{country.dialCode}</span>
                                                        <span className="text-gray-500 flex-1">{country.name}</span>
                                                    </button>
                                                ))}
                                                {filteredCountries.length === 0 && (
                                                    <div className="px-3 py-2 text-gray-500 text-sm">
                                                        No countries found
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="tel"
                                    name="phonenumber"
                                    placeholder="Enter Phone Number"
                                    value={formData.phonenumber}
                                    onChange={handleInputChange}
                                    className="flex-1 block w-full pl-3 pr-3 py-2 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>

                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter Your Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="block w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                {showPassword ?
                                    <Eye
                                        className="h-5 w-5 text-gray-400 cursor-pointer hover:text-green-500"
                                        onClick={() => setShowPassword(false)}
                                    /> :
                                    <EyeOff
                                        className="h-5 w-5 text-gray-400 cursor-pointer hover:text-green-500"
                                        onClick={() => setShowPassword(true)}
                                    />
                                }
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Joining...
                                </div>
                            ) : (
                                "Click to join for free"
                            )}
                        </button>
                        <p className="text-center text-green-500 font-semibold">Join the Thousands who have already started their journey with us.</p>

                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-2 text-center text-gray-600 border-t border-gray-100 pt-2">
                        <p>Don't have an account? <Link to="/register" className="text-green-500 font-semibold hover:text-green-600">Sign up</Link></p>
                    </div>
                </div>

                {/* Footer Note */}
                {/* <p className="text-xs text-gray-500 mt-6 text-center">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p> */}
            </div>
            <ToastContainer />
        </div>
    )
}

export default Login