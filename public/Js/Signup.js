const form = document.querySelector('form')
const submit = document.querySelector('.submits')
const name = document.querySelector('.username')
const password = document.querySelector('.password')
const confirmpassword = document.querySelector('.confirmpassword')
const age = document.querySelector('.age')
const email = document.querySelector('.email')
const result = document.querySelector('.results')
const emailtext = document.querySelector('.emailtext')
const nametext = document.querySelector('.nametext')
const passwordtxt = document.querySelector('.passwordtxt')
const agetxt = document.querySelector('.agetxt')
const main = document.querySelector('.main')

function getAge(dateString) {
    var ageInMilliseconds = new Date() - new Date(dateString);
    return Math.floor(ageInMilliseconds / 1000 / 60 / 60 / 24 / 365);
}


var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");





submit.addEventListener('click', (e) => {
    e.preventDefault()
    if (password.value !== confirmpassword.value) {
        
        result.innerHTML = "<p style=\"color:red;\">password not matching</p>"
    }
    if (password.value === confirmpassword.value) {
        
       if(result.innerHTML === "<p style=\"color:red;\">password not matching</p>"){
        result.innerHTML = "Pls fill out the form"
       }
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        name: name.value,
        age: getAge(age.value),
        email: email.value,
        password: password.value
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://Localhost:3000/users", requestOptions).then(async(result) => 
        {

            resulttext=await result.text()
            
            resultobj = JSON.parse(resulttext)
            
            console.log(resultobj)
            if(resultobj.user){
                console.log(resultobj.user)
                window.alert('User created')
                result.innerHTML ="<p style=\"color:green;\">Account created </p>"
                var now = new Date()
                var time = now.getTime()
                var exptime = time + 200000000*20000
                now.setTime(exptime)
                console.log({now,time})
                console.log(now.toUTCString())
                document.cookie = "Token=" + resultobj.token + ";"  + "expires" +  now.toUTCString() + ";"
            }
            if(resultobj.name){
                nametext.innerHTML = "<span style=\"color:red\">Username:" + resultobj.name + "</span>"
            }else{
                nametext.innerHTML = "<span >Username:</span>"
            }
            if(resultobj.email){
                var emailerr
                
                
                if(resultobj.email === 'user defined'){
                    emailerr = "Invalid email provided"
                    
                } 
                if(emailerr !== 'Invalid email provided'){
                emailerr = resultobj.email
                }
                
                
                emailtext.innerHTML = "<span  style=\"color:red\">Email:" + emailerr +"</span>"

                
            }else{
                emailtext.innerHTML = "<span>Email:</span>"
            }
            if(resultobj.password){
                var pass
                
                if(resultobj.password === 'user defined'){
                    pass = 'Password cannot contain password'
                }else if(resultobj.password === 'minlength'){
                    pass = 'Minimum length is 6 chars'
                }else if(resultobj.password === 'required'){
                    pass = 'required'
                }

                passwordtxt.innerHTML = "<span style=\"color:red\">Password:" +  pass + "</span>"
            }else{
                passwordtxt.innerHTML = "<span >Password:</span>"
            }


            
        })
        .catch(error => {
            
            console.log(error)
        });

    e.preventDefault()
})