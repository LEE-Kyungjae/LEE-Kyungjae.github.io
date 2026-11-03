import json,sys
sys.path.insert(0,'/tmp/portfolio-real-looper')
from src.models.system_configuration import SystemConfiguration
from src.services.pattern_detector import PatternDetector
p=PatternDetector(SystemConfiguration.create_default())
results=[]
for line in ['Build completed successfully.','Usage limit exceeded. Please try again later.']:
 e=p.detect_limit_message(line)
 result={'input':line,'detected':e is not None}
 if e:
  e.start_cooldown()
  result.update(matched_text=e.matched_text,pattern=e.matched_pattern,cooldown_hours=e.cooldown_duration_hours,cooldown_active=e.is_cooldown_active())
 results.append(result)
print(json.dumps({'scope':'Original PatternDetector and LimitDetectionEvent; synthetic stdout input; no Claude process or restart','results':results},indent=2))
