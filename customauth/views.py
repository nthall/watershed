from django.shortcuts import render

from forms import RegistrationForm


def register(request):
    if request.method == "POST":
        # process signup
        pass

    else:
        form = RegistrationForm()
        return render(request, 'register.html', {'form': form})
