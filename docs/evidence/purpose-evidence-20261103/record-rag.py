import os,sys,json,ast,time
from pathlib import Path
os.environ['OBSERVABILITY_DB_PATH']='/tmp/insight-portfolio-observation.db'
sys.path.insert(0,'/Users/ze/work/insight-rag/packages/rag_server')
from app import observability as obs
from app.artifact_maps import build_architecture_graph
root=Path('/tmp/portfolio-real-looper/src/models')
ds=obs.ensure_dataset('ClaudeCodeLooper source inspection','repository')
run=obs.start_run('source_inspection',dataset_id=ds)
graph=build_architecture_graph(root)
art=obs.save_artifact('flow_graph','ClaudeCodeLooper 모델 분석',graph,source={'generated_by':'maps.architecture','scope':'local source inspection; external capture driver, no LLM'})
obs.record_event(run,'artifact.created',artifact_id=art['artifact_id'],payload={'source':'original map generator'})
Path('/tmp/insight-observe-run2.json').write_text(json.dumps({'run_id':run,'artifact_id':art['artifact_id'],'node_count':len(graph['nodes'])}))
while not Path('/tmp/insight-observe-go2').exists():time.sleep(.2)
count=0
for node in graph['nodes']:
 file=root/node['id']
 if not file.is_file():continue
 obs.record_event(run,'tool.started',tool='python.ast',target=node['id'],artifact_id=art['artifact_id'],node_id=node['id'])
 tree=ast.parse(file.read_text());defs=[n.name for n in ast.walk(tree) if isinstance(n,(ast.ClassDef,ast.FunctionDef))]
 time.sleep(.7)
 obs.record_event(run,'tool.completed',tool='python.ast',target=node['id'],artifact_id=art['artifact_id'],node_id=node['id'],payload={'definitions':defs,'count':len(defs)})
 count+=1
obs.finish_run(run,'done',items=count,summary='Read and parsed original source modules; no model invocation')
print(json.dumps({'run_id':run,'items':count}))
