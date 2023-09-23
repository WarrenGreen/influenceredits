/*.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  top: -5px;
  left: 110%;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 100%;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent black transparent transparent;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
} */

export default function Tooltip({children, text}) {
  return (
    <div class="group relative inline-block tooltip">{children}
      <span class="hidden bg-purple-700 text-white p-5 rounded-lg text-center absolute z-10 -top-1 tooltiptext group-hover:block" style={{left: "110%"}}>{text}</span>
    </div>
  )
}