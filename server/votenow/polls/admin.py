from django import forms
from django.contrib import admin
from .models import Poll, PollOption, Vote

# Inline options inside Poll for easy editing
class PollOptionInline(admin.TabularInline):
    model = PollOption
    extra = 1

# Custom form for Poll admin
class PollAdminForm(forms.ModelForm):
    class Meta:
        model = Poll
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(PollAdminForm, self).__init__(*args, **kwargs)

        if self.instance.pk:
            # Editing → show only this poll’s options
            self.fields['winner'].queryset = self.instance.options.all()
        else:
            # Creating → no options yet
            self.fields['winner'].queryset = PollOption.objects.none()
            self.fields['created_by'].required = False

        # Hide created_by field
        self.fields['created_by'].widget = forms.HiddenInput()

@admin.register(Poll)
class PollAdmin(admin.ModelAdmin):
    form = PollAdminForm
    list_display = ("id","title", "category", "created_by", "created_at", "active", "winner")
    list_filter = ("active", "category", "created_at")
    search_fields = ("title", "description", "category")
    inlines = [PollOptionInline]

    def save_model(self, request, obj, form, change):
        if not obj.pk:  # only when creating
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

# Custom form for Vote admin to filter options by poll
class VoteAdminForm(forms.ModelForm):
    class Meta:
        model = Vote
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(VoteAdminForm, self).__init__(*args, **kwargs)

        if 'poll' in self.data:
            try:
                poll_id = int(self.data.get('poll'))
                self.fields['option'].queryset = PollOption.objects.filter(poll_id=poll_id)
            except (ValueError, TypeError):
                self.fields['option'].queryset = PollOption.objects.none()
        elif self.instance.pk:
            self.fields['option'].queryset = self.instance.poll.options.all()
        else:
            self.fields['option'].queryset = PollOption.objects.all()  # ← Fix: Show all initially

@admin.register(PollOption)
class PollOptionAdmin(admin.ModelAdmin):
    list_display = ("option_text", "poll")
    search_fields = ("option_text",)

@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    form = VoteAdminForm
    list_display = ("voted_by", "poll", "option", "voted_at")
    list_filter = ("voted_at", "poll")
    search_fields = ("voted_by__username", "poll__title", "option__option_text")
