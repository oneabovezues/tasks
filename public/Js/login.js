

const password = document.querySelector('.password')
const email = document.querySelector('.email')
const form = document.querySelector('.form')
const emailtxt = document.querySelector('.emailtxt')
const error = document.querySelector('.error')

form.addEventListener('submit',(e)=>{
    e.preventDefault()
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNDUyZTQwNmUwMDU1YWI1YWM2MzMyNSIsImlhdCI6MTY0ODcwMDk5Mn0.x_mMPAUg4xItHHgE-E88G8jrLsNg7FTZIlnzQa0E2PY");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        Email:email.value,
        password:password.value
    });
    

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("http://Localhost:3000/users/log-in", requestOptions)
    .then(response => response.text())
    .then(result => {
        if(result === 'Invalid creds'){

            error.style = 'color:red' 
            return error.textContent = 'Invalid creds'
        }else{
            resultobj = JSON.parse(result)
            error.textContent = ''
            document.cookie= 'token=' + resultobj.token    
            window.location ="account.html"
        }

        console.log(result)
        
        
    })
    .catch(error => console.log('error', error));
    e.preventDefault()
})
