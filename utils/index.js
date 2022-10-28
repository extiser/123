import decode from 'jwt-decode';

export const getTokenData = (req, res) => {
  const decoded = decode(req.headers.authorization.split(' ')[1]);

  return decoded;
}

export const normalize = async (array, ins) => {
  const res = array.reduce((result, object) => {
    if (!result.find(v => v.id === object.id)) {
      result.push(object);
    }
    return result;
  }, []);

  res.map((el) => {
    const res = array.filter(item => item.id === el.id).map(x => x[ins]);
    el[ins] = res;
  });

  return res;
}

export const randomPassword = (length = 10, hasNumbers = true, hasSymbols = true) => {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let password = "";
    if (hasNumbers) {
        chars += "0123456789";
    }
    if (hasSymbols) {
        chars += "!@#$%^&*_-=+";
    }

    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password
};

export const checkStatus = (user) => {
  
}