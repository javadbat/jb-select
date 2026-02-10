import {faker} from '@faker-js/faker'
export const numberOptionList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39'];
export const colorList = [
    {
      id: 1,
      name: "Red",
      value: "#f00",
    },
    {
      id: 2,
      name: "Green",
      value: "#0f0",
    },
    {
      id: 3,
      name: "Blue",
      value: "#00f",
    },
    {
      id: 4,
      name: "Yellow",
      value: "#ff0",
    },
  ]
  export const nameList = faker.helpers.multiple(()=>faker.person.firstName(),{count:100})
  export const persons = faker.helpers.multiple(()=>{
    return {name: faker.person.firstName(), family: faker.person.lastName(), userId:faker.number.int()}
  },{count:100})