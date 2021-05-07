import networkx as nx
import numpy as np
import matplotlib.pyplot as plt
graph_list=[]
for i in range(0,6):
	graph = nx.read_gml("./2dring_with_hole/graph_"+str(i))
	nx.draw(graph,with_labels=True, font_weight='bold')
	plt.show()
	graph_list.append(graph)
distance_matrix = []
for i in range(0,len(graph_list)):
	temp_distance = []
	for j in range(0,len(graph_list)):
		
		distance = nx.graph_edit_distance(graph_list[i], graph_list[j])
		print(distance)
		temp_distance.append(distance)
	distance_matrix.append(temp_distance)

array = np.asarray(distance_matrix)
np.savetxt("2d_ring_new.txt",array)

