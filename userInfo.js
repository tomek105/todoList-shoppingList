const user = {
    name: "Tomasz",
    lastname: "Lis",
    age: 99,
}
export const getFullName = () =>{
    return `Witaj ${user.name} ${user.lastname}! Masz ${user.age} lat chłopie`;
}
export default user;
