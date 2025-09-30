
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils import timezone
from django.db.models import Count
from datetime import timedelta

from users.models import User
from polls.models import Poll, PollOption, Vote
from .serializers import PollStatsSerializer, DashboardSummarySerializer
from users.permissions import IsAdmin

class AdminDashboardAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        now = timezone.now()
        total_users = User.objects.count()
        total_polls = Poll.objects.count()
        active_polls = Poll.objects.filter(active=True).count()

        # top polls by total votes (top 5)
        top_polls_qs = Poll.objects.annotate(total_votes=Count('votes')).order_by('-total_votes')[:5]
        top_polls = [
            {"poll_id": p.id, "title": p.title, "total_votes": p.total_votes}
            for p in top_polls_qs
        ]

        # votes last 7 days (daily counts)
        votes_last_7_days = []
        for i in range(7, 0, -1):
            day_start = (now - timedelta(days=i)).replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day_start + timedelta(days=1)
            votes_count = Vote.objects.filter(voted_at__gte=day_start, voted_at__lt=day_end).count()
            votes_last_7_days.append(votes_count)

        payload = {
            "total_users": total_users,
            "total_polls": total_polls,
            "active_polls": active_polls,
            "top_polls": top_polls,
            "votes_last_7_days": votes_last_7_days
        }
        serializer = DashboardSummarySerializer(payload)
        return Response(serializer.data)

class PoolStatsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request, poll_id):
        poll = Poll.objects.filter(id=poll_id).first()
        if not poll:
            return Response({"detail": "Poll not found."}, status=status.HTTP_404_NOT_FOUND)

        # total votes and per-option
        options = []
        for opt in poll.options.all():
            options.append({
                "option_id": opt.id,
                "option_text": opt.option_text,
                "votes_count": opt.votes.count()
            })
        total_votes = sum(o["votes_count"] for o in options)

        # votes in last 3 hours, hourly buckets (3 values)
        now = timezone.now()
        votes_last_3_hours = []
        for h in range(3, 0, -1):
            start = now - timedelta(hours=h)
            end = start + timedelta(hours=1)
            votes_last_3_hours.append(
                Vote.objects.filter(poll=poll, voted_at__gte=start, voted_at__lt=end).count()
            )

        # simple prediction: choose option with highest votes in last 3 hours;
        # if all zero, fallback to highest total votes; else option with max recent votes
        recent_votes_per_option = {}
        for opt in poll.options.all():
            recent_count = Vote.objects.filter(poll=poll, option=opt, voted_at__gte=now - timedelta(hours=3)).count()
            recent_votes_per_option[opt.id] = (recent_count, opt.option_text)

        predicted = None
        if any(count for count, _ in recent_votes_per_option.values()):
            # pick max by recent_count
            best_id, (best_count, best_text) = max(recent_votes_per_option.items(), key=lambda kv: kv[1][0])
            predicted = {"option_id": best_id, "option_text": best_text, "reason": "highest votes in last 3 hours"}
        else:
            # fallback to total votes
            if total_votes > 0:
                best_opt = max(options, key=lambda o: o["votes_count"])
                predicted = {"option_id": best_opt["option_id"], "option_text": best_opt["option_text"], "reason": "highest total votes"}
            else:
                predicted = None

        payload = {
            "poll_id": poll.id,
            "poll_title": poll.title,
            "total_votes": total_votes,
            "options": options,
            "votes_last_3_hours": votes_last_3_hours,
            "predicted_winner": predicted
        }
        serializer = PollStatsSerializer(payload)
        return Response(serializer.data)
