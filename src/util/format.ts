export let toLocaleString = (value: number) => {
  if(value === 0) {
    return value;
  }else{
  return (value || '-').toLocaleString()
  }
}