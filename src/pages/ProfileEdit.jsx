"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, User, Mail, MapPin, Calendar, Target, Phone, Camera, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useGetuser from "../hooks/user"
import { useDashboard } from '../contexts/DashboardContext'

const ProfileEdit = () => {
    const user = useGetuser();
    const navigate = useNavigate();
    const { resetToHome } = useDashboard();
    const [loading, setLoading] = useState(false);
    const [fetchingProfile, setFetchingProfile] = useState(true);
    const [formData, setFormData] = useState({
        user_id: "",
        name: "",
        gender: "",
        city: "",
        birtyear: "",
        email: "",
        primarygoal: "",
        phonenumber: ""
    });

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


    // Helper function to convert yyyymmdd to yyyy-mm-dd for date input
    const formatDateForInput = (yyyymmdd) => {
        if (!yyyymmdd || yyyymmdd.toString().length !== 8) return "";
        const str = yyyymmdd.toString();
        return `${str.substring(0, 4)}-${str.substring(4, 6)}-${str.substring(6, 8)}`;
    };

    // Helper function to convert yyyy-mm-dd to yyyymmdd integer
    const formatDateForSubmission = (dateStr) => {
        if (!dateStr) return "";
        return parseInt(dateStr.replace(/-/g, ''));
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setFetchingProfile(true);
            const token = localStorage.getItem("token");
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

            if (!token || !storedUser.id) {
                navigate("/login");
                return;
            }

            const response = await axios.get(`https://lightsteelblue-woodcock-286554.hostingersite.com/api/user?user_id=${storedUser.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.data.success) {
                const userData = response.data.user;
                setFormData({
                    user_id: userData.id,
                    name: userData.name || "",
                    gender: userData.gender || "",
                    city: userData.city || "",
                    birtyear: formatDateForInput(userData.birtyear) || "",
                    email: userData.email || "",
                    primarygoal: userData.primarygoal || "",
                    phonenumber: userData.phonenumber || ""
                });

                // Update localStorage with fresh user data
                localStorage.setItem("user", JSON.stringify(userData));
            } else {
                toast.error("Failed to fetch user profile");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            toast.error("Error loading profile. Please try again.");
        } finally {
            setFetchingProfile(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            // Convert date to yyyymmdd format for submission
            const submissionData = {
                ...formData,
                birtyear: formatDateForSubmission(formData.birtyear)
            };

            const response = await axios.put("https://lightsteelblue-woodcock-286554.hostingersite.com/api/profile", submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.data.success) {
                // Update localStorage with new user data
                const updatedUser = { ...JSON.parse(localStorage.getItem("user") || "{}"), ...response.data.user };
                localStorage.setItem("user", JSON.stringify(updatedUser));

                // Update form data with the response data
                setFormData({
                    user_id: response.data.user.id,
                    name: response.data.user.name || "",
                    gender: response.data.user.gender || "",
                    city: response.data.user.city || "",
                    birtyear: formatDateForInput(response.data.user.birtyear) || "",
                    email: response.data.user.email || "",
                    primarygoal: response.data.user.primarygoal || ""
                });

                toast.success("Profile updated successfully!", {
                    position: "top-right",
                    autoClose: 2000,
                });

                setTimeout(() => {
                    resetToHome();
                    navigate("/dashboard");
                }, 1000);
            } else {
                toast.error("Failed to update profile. Please try again.");
            }
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Error updating profile. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const goals = [
        "Weight loss",
        "Flexibility",
        "Stress relief",
        "Strength building",
        "Better sleep",
        "Mindfulness",
        "Overall health"
    ];

    return (
        <div className="min-h-screen max-w-md mx-auto">
            {/* Enhanced Header */}
            <header className="sticky top-0 z-50 bg-white backdrop-blur-lg shadow-sm border-b border-gray-200">
                <div className="flex items-center justify-between p-4">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>
                    <div className="text-center">
                        <h1 className="text-xl font-bold text-gray-800">
                            Edit Profile
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">Update your personal information</p>
                    </div>
                    <div className="w-16"></div>
                </div>
            </header>



            {/* Enhanced Form Content */}
            <main className="p-6 pb-24">
                {fetchingProfile ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                            <p className="text-gray-600 font-medium">Loading your profile...</p>
                            <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Personal Information Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-1">
                            <div className="p-4 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-500" />
                                    Personal Information
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Basic details about yourself</p>
                            </div>

                            <div className="space-y-4 p-4">


                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                        <User className="w-4 h-4 text-gray-400" />
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        required
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        Phone Number<span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center justify-center">
                                        <div className="relative country-dropdown">
                                            {/* Custom Country Dropdown */}
                                            <button
                                                type="button"
                                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                                className="p-4.5 pl-12 pr-4  border border-gray-300 rounded-l-lg bg-gray-100 text-sm font-medium focus:ring-2 focus:ring-[#1D6F42] focus:border-[#1D6F42] min-w-[100px] flex items-center justify-between"
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
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1D6F42] focus:border-[#1D6F42] text-sm"
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
                                            value={formData.phonenumber}
                                            onChange={handleInputChange}
                                            placeholder="Enter your phone number"
                                            className="w-full p-4 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                            required
                                        />
                                    </div>

                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        Email Address<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email address"
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Details Section */}
                        <div className="bg-white rounded-2xl shadow-lg p-1">
                            <div className="p-4 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-green-500" />
                                    Additional Details
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Help us personalize your experience</p>
                            </div>

                            <div className="space-y-4 p-4">
                                {/* Gender */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                        <User className="w-4 h-4 text-gray-400" />
                                        Gender<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* City */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        City<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter your city"
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        required
                                    />
                                </div>

                                {/* Date of Birth */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        Date of Birth<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="birtyear"
                                        value={formData.birtyear}
                                        onChange={handleInputChange}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                                        max={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>

                                {/* Primary Goal */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                                        <Target className="w-4 h-4 text-gray-400" />
                                        Primary Goal<span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="primarygoal"
                                        value={formData.primarygoal}
                                        onChange={handleInputChange}
                                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white appearance-none"
                                        required
                                    >
                                        <option value="">Select Your Primary Goal</option>
                                        {goals.map(goal => (
                                            <option key={goal} value={goal}>{goal}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg group"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                    Updating Profile...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-3">
                                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                    <span className="text-lg">Save Changes</span>
                                </div>
                            )}
                        </button>
                    </form>
                )}
            </main>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default ProfileEdit;