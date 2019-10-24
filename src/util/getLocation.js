import {
    MP
} from "./map";
import
Storage
    from "./storage";
import {
    cityData
} from "../assets/js/cityData";

let areaList = window.c_disposeCityData(cityData)

function getCascaderObj(val, opt) {
    return val.map(function (label) {
        for (let item of opt) {
            if (item.label == label) {
                opt = item.children;
                return item.value;
            }
        }
        return null;
    });
}

async function getLocationPosition() {

    return new Promise((resolve, reject) => {
        MP("kyQyvOBQwLUVrHieFzUcfV1TZt0slzlG").then(BMap => {
            let geoc = new BMap.Geocoder();
            let geolocation = new BMap.Geolocation();
            let locationTxt = [],
                location = []
            geolocation.getCurrentPosition(
                function (r) {
                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                        let pt = r.point;
                        geoc.getLocation(pt, function (rs) {
                            let addComp = rs.addressComponents;
                            locationTxt = [
                                addComp.province,
                                addComp.city,
                                addComp.district
                            ];
                            location = getCascaderObj(
                                locationTxt,
                                areaList
                            );
                            Storage.set("POSITION", {
                                location: location,
                                locationTxt: locationTxt
                            });
                            // Storage.set("POSITION", {
                            //     location: ["350000","350200","350203"],
                            //     locationTxt: ["福建省","厦门市","湖里区"]
                            // });
                            // {"location":["350000","350200","350203"],"locationTxt":["福建省","厦门市","湖里区"]}

                            resolve();

                        });
                    } else {
                        alert("failed" + this.getStatus());
                        reject()
                    }
                }, {
                    enableHighAccuracy: true
                }
            );
        });

    })

}

export default getLocationPosition;
